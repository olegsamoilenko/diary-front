import { apiRequest } from "./api/apiRequest";
import { addDays } from "./diary/addDays";
import { getMonthYearStr } from "./diary/getMonthYearStr";
import { getWeekdayLabels } from "./diary/getWeekdayLabels";
import { getNumbersMonthAndYear } from "./diary/getNumbersMonthAndYear";
import { polarToCartesian } from "./calendar/calendar";
import { isRefObject } from "./common/isRefObject";
import { getTodayDateStr } from "./diary/getTodayDateStr";
import { getFont } from "./common/getFont";
import { uploadImageToServer } from "./files/uploadImageToServer";
import { passwordRules } from "./auth/passwordRules";
import { getStatusColor } from "./colors/getStatusColor";
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
  clearPending,
  prepareImageForStorage,
  queueImage,
  ALBUM_NAME,
  buildAlbumFilename,
  deleteEntryImages,
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
import {
  isSub,
  getAndroidOfferTokenFromProduct,
  getProductPrice,
  getProductTitle,
} from "./iap/helpers";
import { getPlanName } from "./subscription/plans";
import { logStoredUserData } from "./storedUserData";
import { normErr } from "./error/error";

export {
  apiRequest,
  getWeekdayLabels,
  addDays,
  getMonthYearStr,
  getNumbersMonthAndYear,
  polarToCartesian,
  isRefObject,
  getTodayDateStr,
  getFont,
  uploadImageToServer,
  passwordRules,
  getStatusColor,
  aiStreamEmitter,
  addToAiChunkBuffer,
  consumeAiChunkBuffer,
  resetAiChunkBuffer,
  runAIStream,
  compressImageFixed,
  prepareImageForUpload,
  clearPending,
  prepareImageForStorage,
  queueImage,
  replaceImgSrcById,
  tokeniseInlineBase64,
  extractImageIdsFromHtml,
  hydrateHtmlWithLocalUris,
  hydrateEntryHtmlFromAlbum,
  ensureOneTimeMediaAsk,
  getMediaAccess,
  MediaAccess,
  ALBUM_NAME,
  buildAlbumFilename,
  deleteEntryImages,
  isSub,
  getAndroidOfferTokenFromProduct,
  getProductPrice,
  getProductTitle,
  getPlanName,
  logStoredUserData,
  normErr,
};
