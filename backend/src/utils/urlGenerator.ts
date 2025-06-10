interface MediaItem {
  id: number;
  file_name: string;
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  likedByUser: boolean;
  created_by: string;
  deletable: boolean;
}

export function generateCanonicalUrl(fileName: string): string {
  const { S3_ENDPOINT, BUCKET_NAME } = process.env;

  // For Tigris storage, use subdomain-based public URLs
  if (S3_ENDPOINT?.includes('fly.storage.tigris.dev')) {
    return `https://${BUCKET_NAME}.fly.storage.tigris.dev/${fileName}`;
  }

  // Fallback to path-based URLs for other S3-compatible services
  return `${S3_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
}

export function addCanonicalUrlsToMediaItems(mediaItems: any[]): MediaItem[] {
  return mediaItems.map(item => ({
    ...item,
    url: generateCanonicalUrl(item.file_name),
    likedByUser: Boolean(item.likedByUser),
    deletable: Boolean(item.deletable)
  }));
}
