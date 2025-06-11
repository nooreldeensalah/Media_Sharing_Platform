export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  SUPPORTED_VIDEO_TYPES: ["video/mp4", "video/mpeg", "video/quicktime"],
} as const;

export const TIMEOUT_CONSTANTS = {
  PRE_SIGNED_URL: 10000, // 10 seconds
  FILE_UPLOAD: 120000, // 2 minutes
  NOTIFICATION: 10000, // 10 seconds
} as const;
