import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { ensureOneTimeMediaAsk, getMediaAccess } from "./media-permissions";

export const ALBUM_NAME = "Nemory";

type PendingItem = {
  tempUri: string;
  imageId: string;
  width?: number;
  height?: number;
  capturedAt?: string;
};
const pending: PendingItem[] = [];

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

export async function prepareImageForStorage(localUri: string) {
  const r = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 1600 } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
  );
  return r.uri;
}

export function buildAlbumFilename(
  userId: number,
  entryId: number,
  imageId: string,
) {
  return `${ALBUM_NAME}_u${userId}_e${entryId}_${imageId}.jpg`;
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

export async function persistToGalleryWithMeta(
  userId: number,
  entryId: number,
) {
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
  if (!pending.length) return [] as OutItem[];

  await ensureOneTimeMediaAsk();
  const access = await getMediaAccess();
  if (access !== "all") return []; // без доступу нічого не робимо

  const isAndroid = Platform.OS === "android";
  const isiOS = Platform.OS === "ios";

  let album: MediaLibrary.Album | null = null;
  if (isiOS) {
    try {
      album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
    } catch {}
  } else {
    album = null;
  }

  const items = pending.splice(0);
  const out: OutItem[] = [];

  for (const it of items) {
    const filename = buildAlbumFilename(userId, entryId, it.imageId);
    const cachePath = FileSystem.cacheDirectory + filename;
    await FileSystem.copyAsync({ from: it.tempUri, to: cachePath });

    const [sha256, size] = await Promise.all([
      sha256b64(cachePath),
      fileSize(cachePath),
    ]);
    const asset = await MediaLibrary.createAssetAsync(cachePath);

    if (isiOS) {
      try {
        if (!album)
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
        else await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } catch {
        try {
          album = album ?? (await MediaLibrary.getAlbumAsync(ALBUM_NAME));
          if (album)
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
        } catch {}
      }
    }

    if (isAndroid) {
      try {
        const existing = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        if (existing) {
          console.log(111);
          await MediaLibrary.addAssetsToAlbumAsync([asset], existing, true);
        } else {
          console.log(222);
          await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, true);
        }
      } catch {}
      await MediaLibrary.deleteAssetsAsync([asset.id]);
    }

    out.push({
      imageId: it.imageId,
      filename,
      sha256,
      fileSize: size,
      width: it.width,
      height: it.height,
      capturedAt: it.capturedAt,
      assetId: asset.id,
      localUri: cachePath,
    });
  }
  return out;
}
