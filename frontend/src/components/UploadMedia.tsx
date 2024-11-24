import React, { useState, useRef } from 'react';
import { uploadMedia } from '../api';
import { toast } from 'react-toastify';

interface MediaItem {
  id: number;
  file_name: string;
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  likedByUser: boolean;
  created_by: string;
}

interface UploadMediaProps {
  addNewMediaItem: (newMedia: MediaItem) => void;
}

const UploadMedia: React.FC<UploadMediaProps> = ({ addNewMediaItem }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Reference to the file input element
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

      // Reset the file input and selected file state
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input's value
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
      <label htmlFor="file-upload" className="mb-2 block text-sm font-medium text-gray-700">
        Choose file to upload
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef} // Attach the ref to the file input
        className="mb-4 border p-2 w-full"
        placeholder="Choose file"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadMedia;
