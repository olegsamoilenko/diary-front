import { EPlatform } from "@/types";

export type ReleaseNotification = {
  id: number;
  defaultLocale: string;
  platform: EPlatform.IOS;
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
