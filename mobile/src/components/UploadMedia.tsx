import React from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadMedia } from "../api";
import { UploadMediaProps } from "../types";

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
        const originalFileName = result.assets[0].fileName || "unknown-file.jpeg";
        const uuidFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch(fileUri);
        const blob = await response.blob();

        const uploadedMedia = await uploadMedia(blob, fileMimeType, uuidFileName, originalFileName);
        addNewMediaItem(uploadedMedia);
      } catch (error) {
        console.error("Error uploading media:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Media" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default UploadMedia;
