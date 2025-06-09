import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CloudArrowUpIcon, PhotoIcon, FilmIcon } from "@heroicons/react/24/outline";
import { uploadMedia } from "../api";
import { toast } from "react-toastify";
import { Button } from "./ui/Button";
import { UploadMediaProps } from "../types";

const UploadMedia: React.FC<UploadMediaProps> = ({ addNewMediaItem }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleUpload(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/', 'video/'];
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      toast.error(t('validation.invalidFileType'));
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(t('validation.fileSizeLimit'));
      return;
    }

    try {
      setUploading(true);
      const uploadedMedia = await uploadMedia(file);
      addNewMediaItem(uploadedMedia);
      toast.success(t('media.uploadSuccess'));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(t('media.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        title={t('media.upload')}
      />

      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
        } hover:border-primary-400 hover:bg-primary-25 dark:hover:bg-primary-900/10`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{
              y: dragOver ? -5 : 0,
              scale: dragOver ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-full">
              <CloudArrowUpIcon className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {dragOver ? t('upload.dropHere') : t('media.upload')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('upload.dragDrop')}
            </p>

            <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <PhotoIcon className="h-5 w-5 mr-1 rtl:mr-0 rtl:ml-1" />
                {t('upload.images')}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FilmIcon className="h-5 w-5 mr-1 rtl:mr-0 rtl:ml-1" />
                {t('upload.videos')}
              </div>
            </div>

            <Button
              onClick={handleButtonClick}
              loading={uploading}
              disabled={uploading}
              className="mx-auto"
              aria-label={t('a11y.uploadButton')}
            >
              {uploading ? t('media.uploading') : t('upload.chooseFiles')}
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('upload.maxSize')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadMedia;
