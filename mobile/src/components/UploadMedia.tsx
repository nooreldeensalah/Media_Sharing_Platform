import React from "react";
import { View, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadMedia } from "../api";

interface UploadMediaProps {
  addNewMediaItem: (newMedia: any) => void;
}

const UploadMedia: React.FC<UploadMediaProps> = ({ addNewMediaItem }) => {
  const handleUpload = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to upload media.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const fileUri = result.assets[0].uri;
        const fileMimeType = result.assets[0].mimeType || "image/jpeg";
        const fileName = result.assets[0].fileName || "random-file-name.jpeg";

        const response = await fetch(fileUri);
        const blob = await response.blob();

        const uploadedMedia = await uploadMedia(blob, fileMimeType, fileName);
        addNewMediaItem(uploadedMedia);
      } catch (error) {
        console.error("Error uploading media:", error);
      }
    }
  };

  return (
    <View>
      <Button title="Upload Media" onPress={handleUpload} />
    </View>
  );
};

export default UploadMedia;
