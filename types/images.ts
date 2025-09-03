export type EntryImage = {
  id: number;
  entryId: number;
  imageId: string;
  filename: string;
  sha256: string;
  fileSize: string;
  width?: number;
  height?: number;
  capturedAt?: Date;
  assetId?: string;
  createdAt: Date;
};
