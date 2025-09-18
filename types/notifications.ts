export type ReleaseNotification = {
  id: number;
  defaultLocale: string;
  platform: "ios" | "android";
  build: number;
  translations: ReleaseNotificationTranslation[];
  createdAt: Date;
};

export type ReleaseNotificationTranslation = {
  id: number;
  locale: string;
  html: string;
  docJson?: any;
  createdAt: Date;
};
