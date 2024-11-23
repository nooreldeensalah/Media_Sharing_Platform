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
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const formData = new FormData();
      formData.append("file", "file");

      try {
        const uploadedMedia = await uploadMedia(formData);
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
