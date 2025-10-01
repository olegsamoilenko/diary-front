import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ALBUM_NAME } from "./media";

export function replaceImgSrcById(
  html: string,
  imageId: string,
  newSrc: string,
) {
  const re = new RegExp(
    `(<img[^>]*id=["']${imageId}["'][^>]*src=["'])[^\"]*(["'][^>]*>)`,
    "g",
  );
  return html.replace(re, `$1${newSrc}$2`);
}

export function tokeniseInlineBase64(html: string) {
  if (!html) return html;
  const re =
    /(<img[^>]*\bid=["'](img-[^"']+)["'][^>]*\bsrc=["'])data:image\/[^"']+(["'][^>]*>)/g;
  return html.replace(
    re,
    (_m, p1, imageId, p3) => `${p1}nemory://i/${imageId}${p3}`,
  );
}

export function hydrateHtmlWithLocalUris(
  html: string,
  items: { imageId: string; localUri?: string }[],
) {
  let out = html;
  for (const it of items) {
    if (it.localUri) out = replaceImgSrcById(out, it.imageId, it.localUri);
  }
  return out;
}

const IMG_TOKEN_RE =
  /<img[^>]*\bid=["'](img-[^"']+)["'][^>]*\bsrc=["']nemory:\/\/i\/[^"']+["'][^>]*>/g;

export function extractImageIdsFromHtml(html: string): string[] {
  const ids = new Set<string>();
  html.replace(IMG_TOKEN_RE, (_m, id) => {
    ids.add(id);
    return _m;
  });
  return [...ids];
}

async function listAlbumAssets() {
  const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  if (!album) return [] as MediaLibrary.Asset[];

  let out: MediaLibrary.Asset[] = [];
  let page = await MediaLibrary.getAssetsAsync({
    album,
    mediaType: ["photo"],
    first: 1000,
    sortBy: MediaLibrary.SortBy.creationTime,
  });
  out = out.concat(page.assets);
  while (page.hasNextPage) {
    page = await MediaLibrary.getAssetsAsync({
      album,
      mediaType: ["photo"],
      first: 1000,
      after: page.endCursor,
      sortBy: MediaLibrary.SortBy.creationTime,
    });
    out = out.concat(page.assets);
  }
  return out;
}

export async function hydrateEntryHtmlFromAlbum(
  html: string,
  userId: number,
  entryId: number,
) {
  const ids = extractImageIdsFromHtml(html);

  if (!ids.length) return html;

  const assets = await listAlbumAssets();

  if (!assets.length) return html;

  const byName = new Map<string, MediaLibrary.Asset>();

  for (const a of assets) byName.set(a.filename, a);

  let out = html;

  for (const imageId of ids) {
    const base = buildAlbumBasename(userId, entryId, imageId).toLowerCase();

    const asset =
      assets.find((a) => {
        const name = (a.filename || "").toLowerCase();
        return name.startsWith(base + ".");
      }) || null;

    if (!asset) continue;

    let localUri: string | null = null;
    try {
      const info = await MediaLibrary.getAssetInfoAsync(asset);
      if (info.localUri && info.localUri.startsWith("file://")) {
        localUri = info.localUri;
      } else if (asset.uri) {
        const name =
          info.filename ??
          asset.filename ??
          `${buildAlbumBasename(userId, entryId, imageId)}.jpg`;
        const target = `${FileSystem.cacheDirectory}${name}`;
        try {
          await FileSystem.copyAsync({
            from: info.localUri ?? asset.uri,
            to: target,
          });
          localUri = target;
        } catch {
          if (info.localUri) localUri = info.localUri;
        }
      }
    } catch {}

    if (localUri) out = replaceImgSrcById(out, imageId, localUri);
  }

  return out;
}

export function buildAlbumBasename(
  userId: number,
  entryId: number,
  imageId: string,
) {
  return `${ALBUM_NAME}_u${userId}_e${entryId}_${imageId}`;
}

export function buildAlbumFilename(
  userId: number,
  entryId: number,
  imageId: string,
  ext: string,
) {
  return `${buildAlbumBasename(userId, entryId, imageId)}.${ext}`;
}
