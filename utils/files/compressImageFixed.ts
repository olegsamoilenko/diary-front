import * as ImageManipulator from "expo-image-manipulator";

export async function compressImageFixed(uri: any, maxMb = 10, compress = 0.8) {
  let imageUri = uri;

  while (true) {
    const manipResult = await ImageManipulator.manipulateAsync(imageUri, [], {
      compress,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    const response = await fetch(manipResult.uri);
    const blob = await response.blob();
    const sizeMb = blob.size / 1024 / 1024;

    if (sizeMb <= maxMb) {
      return manipResult.uri;
    }

    if (imageUri === manipResult.uri) {
      return manipResult.uri;
    }

    imageUri = manipResult.uri;
  }
}
