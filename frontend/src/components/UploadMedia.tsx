import React, { useState, useRef } from 'react';
import { uploadMedia } from '../api';
import { toast } from 'react-toastify';
import FileInput from './FileInput';
import UploadButton from './UploadButton';
import { MediaItem } from '../types';

interface UploadMediaProps {
  addNewMediaItem: (newMedia: MediaItem) => void;
}

const UploadMedia: React.FC<UploadMediaProps> = ({ addNewMediaItem }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      const uploadedMedia = await uploadMedia(selectedFile);
      addNewMediaItem(uploadedMedia);
      toast.success('Media uploaded successfully!');
      setSelectedFile(null);
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

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Upload Media</h2>
      <FileInput handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      <UploadButton handleUpload={handleUpload} uploading={uploading} />
    </div>
  );
};

export default UploadMedia;