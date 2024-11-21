// src/components/UploadMedia.tsx
import React, { useState } from "react";
import { uploadMedia } from "../api";

const UploadMedia = () => {
  const [message, setMessage] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const response = await uploadMedia(file);
      setMessage(response.message);
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleUpload} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadMedia;
