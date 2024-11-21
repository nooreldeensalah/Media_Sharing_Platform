const BASE_URL = "http://localhost:3000";

export const getAllMedia = async () => {
  const response = await fetch(`${BASE_URL}/media`);
  return response.json();
};

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/media/upload`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const likeMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}/like`, {
    method: "POST",
  });

  return response.json();
};

export const unlikeMedia = async (fileName: string) => {
  const response = await fetch(`${BASE_URL}/media/${fileName}/unlike`, {
    method: "POST",
  });

  return response.json();
};
