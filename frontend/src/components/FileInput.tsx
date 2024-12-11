import React from 'react';
import { FileInputProps } from '../types';

const FileInput: React.FC<FileInputProps> = ({ handleFileChange, fileInputRef }) => {
  return (
    <>
      <label htmlFor="file-upload" className="sr-only">
        Choose file to upload
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </>
  );
};

export default FileInput;
