export type Dialog = {
  id?: number;
  uuid: string;
  question: string;
  answer: string;
  entryId?: string;
  loading?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
