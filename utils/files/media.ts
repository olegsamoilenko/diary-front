import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { ensureOneTimeMediaAsk, getMediaAccess } from "@/utils";
import type { EntryImage } from "@/types";

export const ALBUM_NAME = "Nemory";

type PendingItem = {
  tempUri: string;
  imageId: string;
  width?: number;
  height?: number;
  capturedAt?: string;
};

type OutItem = {
  imageId: string;
  filename: string;
  sha256: string;
  fileSize: string;
  width?: number;
  height?: number;
  capturedAt?: string;
  assetId?: string;
  localUri?: string;
};

type PrivateImage = {
  imageId: string;
  filename: string;
  uri: string;
  sha256: string;
  fileSize: string;
  width?: number;
  height?: number;
  capturedAt?: string;
  createdAt: number;
};

const pending: PendingItem[] = [];

export async function persistPrivateThenMaybeExportWithMeta(
  userId: number,
  entryId: number,
  opts?: { exportToGallery?: boolean; preferSAFOnAndroid?: boolean },
): Promise<OutItem[]> {
  const rawItems = __takeAllPendingForSave();
  const seen = new Set<string>();
  const items = rawItems.filter((it) => {
    if (seen.has(it.imageId)) return false;
    seen.add(it.imageId);
    return true;
  });
  if (!items.length) return [];

  const out: OutItem[] = [];

  let album: MediaLibrary.Album | null = null;
  if (opts?.exportToGallery && Platform.OS === "ios") {
    album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  }

  for (const it of items) {
    const prepared = await prepareImageForStorage(it.tempUri);
    const preparedExt =
      getExtFromUri(prepared) || getExtFromUri(it.tempUri) || "jpg";
    const filename = buildAlbumFilename(
      userId,
      entryId,
      it.imageId,
      preparedExt,
    );

    const priv = await savePrivateImage(
      userId,
      entryId,
      it.imageId,
      prepared,
      {
        width: it.width,
        height: it.height,
        capturedAt: it.capturedAt,
      },
      filename,
    );

    let assetId: string | undefined;

    if (opts?.exportToGallery) {
      try {
        await ensureOneTimeMediaAsk();
        const access = await getMediaAccess();
        if (access !== "all") {
          console.warn("No media access");
        } else {
          if (!album) album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

          if (!album) {
            if (Platform.OS === "android") {
              album = await MediaLibrary.createAlbumAsync(
                ALBUM_NAME,
                undefined as any,
                undefined as any,
                priv.uri,
              );
              assetId = (
                await findAssetInAlbumByFilename(album.id as any, filename)
              )?.id;
            } else {
              const initial = await MediaLibrary.createAssetAsync(priv.uri);
              album = await MediaLibrary.createAlbumAsync(
                ALBUM_NAME,
                initial,
                true,
              );
              assetId = initial.id;
            }
          } else {
            const asset = await MediaLibrary.createAssetAsync(priv.uri, album);
            assetId = asset.id;
          }
        }
      } catch (e: any) {
        console.warn("Export failed", e);
        console.warn("Export failed response", e.response);
        console.warn("Export failed response data", e.response.data);
      }
    }

    out.push({
      imageId: it.imageId,
      filename,
      sha256: priv.sha256,
      fileSize: String(priv.fileSize),
      width: it.width,
      height: it.height,
      capturedAt: it.capturedAt,
      assetId,
      localUri: priv.uri,
    });
  }

  return out;
}

export function queueImage(
  tempUri: string,
  imageId: string,
  meta?: Omit<PendingItem, "tempUri" | "imageId">,
) {
  pending.push({ tempUri, imageId, ...meta });
}
export function clearPending() {
  pending.length = 0;
}

export function __takeAllPendingForSave(): PendingItem[] {
  const items = pending.splice(0); // забрали все і обнулили
  return items;
}

export async function prepareImageForStorage(localUri: string) {
  const ext = getExtFromUri(localUri);
  const fmt = getManipulatorFormat(ext);

  if (!fmt) return localUri;

  const compress = fmt === ImageManipulator.SaveFormat.PNG ? 1 : 0.9;

  const r = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 1600 } }],
    { compress, format: fmt },
  );
  return r.uri;
}

export async function savePrivateImage(
  userId: number,
  entryId: number,
  imageId: string,
  srcUri: string,
  meta?: { width?: number; height?: number; capturedAt?: string },
  filenameOverride?: string,
): Promise<PrivateImage> {
  const baseDir = FileSystem.documentDirectory!;
  const userDir = `${baseDir}nemory/u${userId}/`;
  const entryDir = `${userDir}e${entryId}/`;
  await ensureDir(entryDir);

  const filename =
    filenameOverride ??
    buildAlbumFilename(
      userId,
      entryId,
      imageId,
      getExtFromUri(srcUri) || "jpg",
    );
  const dstUri = `${entryDir}${filename}`;

  await FileSystem.copyAsync({ from: srcUri, to: dstUri });

  const [hash, size] = await Promise.all([sha256b64(dstUri), fileSize(dstUri)]);

  const out: PrivateImage = {
    imageId,
    filename,
    uri: dstUri,
    sha256: hash,
    fileSize: size,
    width: meta?.width,
    height: meta?.height,
    capturedAt: meta?.capturedAt,
    createdAt: Date.now(),
  };

  return out;
}

async function ensureDir(dir: string) {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function findAssetInAlbumByFilename(
  albumId: string,
  filename: string,
  pageSize = 200,
): Promise<MediaLibrary.Asset | null> {
  const target = filename.toLowerCase();

  let after: string | undefined = undefined;
  let hasNext = true;

  while (hasNext) {
    const page = await MediaLibrary.getAssetsAsync({
      album: albumId,
      first: pageSize,
      after,
      mediaType: [MediaLibrary.MediaType.photo],
      sortBy: [MediaLibrary.SortBy.creationTime],
    });

    const match =
      page.assets.find((a) => (a.filename || "").toLowerCase() === target) ||
      null;

    if (match) return match;

    hasNext = !!page.hasNextPage;
    after = page.endCursor ?? undefined;
  }

  return null;
}

export function buildAlbumFilename(
  userId: number,
  entryId: number,
  imageId: string,
  ext: string,
) {
  return `${ALBUM_NAME}_u${userId}_e${entryId}_${imageId}.${ext}`;
}

async function sha256b64(uri: string) {
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, b64);
}
async function fileSize(uri: string) {
  const info = await FileSystem.getInfoAsync(uri, { size: true });
  return String(info.size ?? 0);
}

function getExtFromUri(uri: string): string {
  const m = uri?.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
  return (m?.[1] || "").toLowerCase();
}

function getManipulatorFormat(ext: string) {
  if (ext === "jpg" || ext === "jpeg") return ImageManipulator.SaveFormat.JPEG;
  if (ext === "png") return ImageManipulator.SaveFormat.PNG;
  if (Platform.OS === "android" && ext === "webp")
    return ImageManipulator.SaveFormat.WEBP;
  return null; // інші формати не підтримуємо → не чіпаємо
}

export async function deleteEntryImages(entriesImages: EntryImage[]) {
  const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

  const assetIds: string[] = [];

  for (const img of entriesImages) {
    if (img.assetId) {
      assetIds.push(img.assetId);
    } else if (album && img.filename) {
      const a = await findAssetInAlbumByFilename(album.id as any, img.filename);
      if (a?.id) assetIds.push(a.id);
    }
  }

  if (!assetIds.length) return;

  try {
    await MediaLibrary.deleteAssetsAsync(assetIds);
  } catch (e: any) {
    console.warn("Failed to delete assets", e);
    console.warn("Failed to delete assets response", e.response);
    console.warn("Failed to delete assets response data", e.response.data);
  }
}
