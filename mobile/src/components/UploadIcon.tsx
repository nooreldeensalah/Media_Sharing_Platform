import React from "react";
import { TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadMedia } from "../api";

interface UploadIconProps {
  addNewMediaItem: (newMedia: any) => void;
}

const UploadIcon: React.FC<UploadIconProps> = ({ addNewMediaItem }) => {
  const handleUpload = async () => {
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
    <TouchableOpacity style={styles.uploadIcon} onPress={handleUpload}>
      <Ionicons name="cloud-upload-outline" size={32} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee",
    borderRadius: 50,
    padding: 16,
  },
});

export default UploadIcon;
