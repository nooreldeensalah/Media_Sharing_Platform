import React, { useState, useRef } from 'react';
import { uploadMedia } from '../api';
import { toast } from 'react-toastify';
import UploadButton from './UploadButton';
import { UploadMediaProps } from '../types';

const UploadMedia: React.FC<UploadMediaProps> = ({ addNewMediaItem }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleUpload(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const uploadedMedia = await uploadMedia(file);
      addNewMediaItem(uploadedMedia);
      toast.success('Media uploaded successfully!');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        title="Upload file"
      />
      <UploadButton handleUpload={handleButtonClick} uploading={uploading} />
    </>
  );
};

export default UploadMedia;
