import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadMedia } from "../api";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from "react-i18next";
import { getColors } from "../constants/Colors";
import { UploadIconProps } from "../types";
import { UPLOAD_CONSTANTS } from "../constants/Upload";

const UploadIcon: React.FC<UploadIconProps> = ({ addNewMediaItem }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const toast = useToast();
  const { t } = useTranslation();

  const handleUpload = async () => {
    if (isUploading) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(t("permission.required"), t("permission.photoLibrary"));
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

        // Validate file size (50MB limit)
        if (fileSize && fileSize > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
          toast.error(t("error"), t("validation.fileSizeLimit"));
          return;
        }

        const uuidFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
          uuidFileName,
          originalFileName,
        );

        addNewMediaItem(uploadedMedia);
        toast.success(t("success"), t("media.uploadSuccess"));
      } catch (error: any) {
        const errorMessage = error?.message || "Unknown error";

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
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.uploadIcon,
        {
          backgroundColor: colors.primary,
          opacity: isUploading ? 0.7 : 1,
        },
      ]}
      onPress={handleUpload}
      disabled={isUploading}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {isUploading ? (
          <Ionicons name="hourglass-outline" size={28} color="white" />
        ) : (
          <Ionicons name="add" size={28} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UploadIcon;
