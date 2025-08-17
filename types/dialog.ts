export type Dialog = {
  id?: number | string;
  uuid?: string;
  question: string;
  answer?: string;
  entryId?: string;
  loading?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
