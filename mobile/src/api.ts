import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const registerUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
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
    throw new Error("Failed to login user");
  }
  await AsyncStorage.setItem("username", username);
  return response.json();
};

export const getAllMedia = async () => {
  const response = await fetch(`${BASE_URL}/media`, {
    headers: await getAuthHeaders(),
  });
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
  fileName: string
) => {
  // Step 1: Request a pre-signed PUT URL from the backend
  const preSignedResponse = await fetch(`${BASE_URL}/media/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ fileName, mimeType }),
  });

  if (!preSignedResponse.ok) {
    throw new Error("Failed to fetch pre-signed URL");
  }

  const { url } = await preSignedResponse.json();

  // Step 2: Upload the file to the pre-signed URL
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

  // Step 3: Notify the backend that the upload is complete
  const notifyResponse = await fetch(`${BASE_URL}/media/notify-upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ fileName, mimeType }),
  });

  if (!notifyResponse.ok) {
    throw new Error("Failed to notify backend about upload");
  }

  return notifyResponse.json();
};

export const deleteMedia = async (id: number) => {
  const response = await fetch(`${BASE_URL}/media/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete media");
  }

  return response.json();
};

export const likeMedia = async (id: number) => {
  const response = await fetch(`${BASE_URL}/media/${id}/like`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to like media");
  }

  return response.json();
};

export const unlikeMedia = async (id: number) => {
  const response = await fetch(`${BASE_URL}/media/${id}/unlike`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to unlike media");
  }

  return response.json();
};
