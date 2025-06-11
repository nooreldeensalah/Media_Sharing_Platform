import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadMedia } from "../api";
import { MediaItem } from "../types";
import { UPLOAD_CONSTANTS } from "../constants/Upload";
import { useTranslation } from "react-i18next";
import { useToast } from "../contexts/ToastContext";

interface UseMediaUploadProps {
  onMediaUploaded: (media: MediaItem) => void;
}

export const useMediaUpload = ({ onMediaUploaded }: UseMediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string>();
  const [uploadIsVideo, setUploadIsVideo] = useState(false);

  const { t } = useTranslation();
  const toast = useToast();

  const handleUpload = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        toast.error(t("permission.required"), t("permission.photoLibrary"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        try {
          setIsUploading(true);

          const fileUri = result.assets[0].uri;
          const fileMimeType = result.assets[0].mimeType || "image/jpeg";
          const originalFileName =
            result.assets[0].fileName || "uploaded-file.jpeg";
          const fileSize = result.assets[0].fileSize;
          const videoFlag = fileMimeType.startsWith("video/");

          // Validate file size (50MB limit)
          if (fileSize && fileSize > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
            toast.error(t("error"), t("validation.fileSizeLimit"));
            return;
          }

          // Set upload state for UI
          setUploadFileName(originalFileName);
          setUploadIsVideo(videoFlag);

          // Fetch the file as blob
          const response = await fetch(fileUri);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch file: ${response.status} ${response.statusText}`,
            );
          }

          const blob = await response.blob();

          // Upload the media
          const uploadedMedia = await uploadMedia(
            blob,
            fileMimeType,
            originalFileName,
            originalFileName,
          );

          onMediaUploaded(uploadedMedia);
          toast.success(t("success"), t("media.uploadSuccess"));
        } catch (uploadError: any) {
          const errorMessage = uploadError?.message || "Unknown error";

          if (errorMessage.includes("Network request failed")) {
            toast.error(
              t("error"),
              t("uploadError") + " - " + t("general.retry"),
            );
          } else if (errorMessage.includes("fetch")) {
            toast.error(
              t("error"),
              "Failed to read file - " + t("general.retry"),
            );
          } else {
            toast.error(t("error"), t("media.uploadFailed"));
          }
        } finally {
          setIsUploading(false);
          setUploadFileName(undefined);
          setUploadIsVideo(false);
        }
      }
    } catch (permissionError) {
      console.error("Upload initialization failed:", permissionError);
      toast.error(t("error"), t("uploadFailedToStart"));
    }
  }, [onMediaUploaded, toast, t]);

  return {
    isUploading,
    uploadFileName,
    uploadIsVideo,
    handleUpload,
  };
};
