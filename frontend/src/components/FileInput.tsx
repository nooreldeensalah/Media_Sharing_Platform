import React from 'react';

interface FileInputProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileInput: React.FC<FileInputProps> = ({ handleFileChange, fileInputRef }) => {
  return (
    <>
      <label htmlFor="file-upload" className="mb-2 block text-sm font-medium text-gray-700">
        Choose file to upload
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="mb-4 border p-2 w-full"
        placeholder="Choose file"
      />
    </>
  );
};

export default FileInput;
