import { apiRequest } from "./api/apiRequest";
import { addDays } from "./diary/addDays";
import { getMonthYearStr } from "./diary/getMonthYearStr";
import { getWeekdayLabels } from "./diary/getWeekdayLabels";
import { getNumbersMonthAndYear } from "./diary/getNumbersMonthAndYear";
import { lightenColor } from "./colors/lightenColor";
import { polarToCartesian } from "./calendar/calendar";
import { isRefObject } from "./common/isRefObject";
import { getTodayDateStr } from "./diary/getTodayDateStr";
import { getFont } from "./common/getFont";
import { uploadImageToServer } from "./files/uploadImageToServer";
import { passwordRules } from "./auth/passwordRules";
import { getStatusColor } from "./colors/getStatusColor";
import { getToken } from "./api/getToken";
import aiStreamEmitter from "./events/eventEmitter";
import {
  addToAiChunkBuffer,
  consumeAiChunkBuffer,
  resetAiChunkBuffer,
} from "./events/aiChunkBuffer";
import { runAIStream } from "./diary/socket/runAIStream";
import { compressImageFixed } from "./files/compressImageFixed";
import { prepareImageForUpload } from "./files/prepareImageForUpload";
import {
  persistToGalleryWithMeta,
  clearPending,
  prepareImageForStorage,
  queueImage,
  ALBUM_NAME,
  buildAlbumFilename,
} from "./files/media";
import {
  replaceImgSrcById,
  tokeniseInlineBase64,
  extractImageIdsFromHtml,
  hydrateHtmlWithLocalUris,
  hydrateEntryHtmlFromAlbum,
} from "./files/html";
import {
  ensureOneTimeMediaAsk,
  getMediaAccess,
  MediaAccess,
} from "./files/media-permissions";

export {
  apiRequest,
  getWeekdayLabels,
  addDays,
  getMonthYearStr,
  getNumbersMonthAndYear,
  lightenColor,
  polarToCartesian,
  isRefObject,
  getTodayDateStr,
  getFont,
  uploadImageToServer,
  passwordRules,
  getStatusColor,
  getToken,
  aiStreamEmitter,
  addToAiChunkBuffer,
  consumeAiChunkBuffer,
  resetAiChunkBuffer,
  runAIStream,
  compressImageFixed,
  prepareImageForUpload,
  persistToGalleryWithMeta,
  clearPending,
  prepareImageForStorage,
  queueImage,
  replaceImgSrcById,
  tokeniseInlineBase64,
};
