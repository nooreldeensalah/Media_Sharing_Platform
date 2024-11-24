import React from 'react';

interface UploadButtonProps {
  handleUpload: () => void;
  uploading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ handleUpload, uploading }) => {
  return (
    <button
      onClick={handleUpload}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      disabled={uploading}
    >
      {uploading ? 'Uploading...' : 'Upload'}
    </button>
  );
};

export default UploadButton;
