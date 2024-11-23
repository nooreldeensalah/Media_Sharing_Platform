const BASE_URL = "http://192.168.1.11:3000";

export const getAllMedia = async () => {
  const response = await fetch(`${BASE_URL}/media`);
  if (response.status === 204) {
    return [];
  }
  if (!response.ok) {
    throw new Error("Failed to fetch media");
  }
  return response.json();
};

export const uploadMedia = async (
  file: Blob,
  mimeType: string,
  fileName: string,
) => {
  // Step 1: Request a pre-signed PUT URL from the backend
  const preSignedResponse = await fetch(`${BASE_URL}/media/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName }),
  });

  if (!preSignedResponse.ok) {
    throw new Error("Failed to fetch pre-signed URL");
  }

  const { url } = await preSignedResponse.json();

  // Step 2: Use the pre-signed URL to upload the file directly to MinIO
  const uploadResponse = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to MinIO");
  }

  const notifyResponse = await fetch(`${BASE_URL}/media/notify-upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName, mimeType }),
  });

  if (!notifyResponse.ok) {
    throw new Error("Failed to notify backend about upload");
  }

  return notifyResponse.json();
};

export const deleteMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete media");
  }

  return response.json();
};

export const likeMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to like media");
  }

  return response.json();
};

export const unlikeMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}/unlike`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to unlike media");
  }

  return response.json();
};
