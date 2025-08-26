import { compressImageFixed } from "./compressImageFixed"; // або твоя функція

export async function prepareImageForUpload(imageUri: any) {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const sizeMb = blob.size / 1024 / 1024;

  if (sizeMb > 10) {
    const compressedUri = await compressImageFixed(imageUri, 10, 0.8);
    return compressedUri;
  } else {
    return imageUri;
  }
}
