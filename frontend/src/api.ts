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

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/media/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload media');
  }

  return response.json();
};

export const deleteMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete media');
  }

  return response.json();
};

export const likeMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}/like`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to like media');
  }

  return response.json();
};

export const unlikeMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}/unlike`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to unlike media');
  }

  return response.json();
};
