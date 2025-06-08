import { v4 as uuidv4 } from "uuid";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const getAllMedia = async (page: number = 1, limit: number = 20) => {
  const response = await fetch(`${BASE_URL}/media?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (response.status === 204) {
    return { data: [], pagination: null };
  }
  if (!response.ok) {
    throw new Error("Failed to fetch media");
  }
  return response.json();
};

export const uploadMedia = async (file: File) => {
  const fileName = uuidv4();

  // Step 1: Request a pre-signed PUT URL from the backend
  const preSignedResponse = await fetch(`${BASE_URL}/media/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ fileName, mimeType: file.type }),
  });

  if (!preSignedResponse.ok) {
    throw new Error("Failed to fetch pre-signed URL");
  }

  const { url } = await preSignedResponse.json();

  // Step 2: Use the pre-signed URL to upload the file directly to MinIO
  const uploadResponse = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
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
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ fileName, mimeType: file.type }),
  });

  if (!notifyResponse.ok) {
    throw new Error("Failed to notify backend about upload");
  }

  return notifyResponse.json();
};

export const deleteMedia = async (id: number) => {
  const response = await fetch(`${BASE_URL}/media/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete media");
  }

  return response.json();
};

export const likeMedia = async (id: number) => {
  const response = await fetch(`${BASE_URL}/media/${id}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to like media");
  }

  return response.json();
};

export const unlikeMedia = async (id: number) => {
  const response = await fetch(`${BASE_URL}/media/${id}/unlike`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to unlike media");
  }

  return response.json();
};
