import React from 'react';
import { FaUpload } from 'react-icons/fa';

interface UploadButtonProps {
  handleUpload: () => void;
  uploading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ handleUpload, uploading }) => {
  return (
    <button
      onClick={handleUpload}
      className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10 hover:bg-blue-600 transition"
      disabled={uploading}
      title="Upload File"
      aria-label="Upload File"
    >
      <FaUpload size={24} />
    </button>
  );
};

export default UploadButton;
