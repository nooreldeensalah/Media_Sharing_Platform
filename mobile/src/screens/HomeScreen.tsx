import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllMedia } from "../api";
import MediaList from "../components/MediaList";
import UploadMedia from "../components/UploadMedia";

interface HomeScreenProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

interface MediaItem {
  id: number;
  file_name: string;
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  likedByUser: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setIsAuthenticated }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getAllMedia();
        setMediaItems(mediaData);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const addNewMediaItem = (newMedia: MediaItem) => {
    setMediaItems((prevItems) => [...prevItems, newMedia]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Media Sharing Platform</Text>
      <Button title="Logout" onPress={handleLogout} />
      <UploadMedia addNewMediaItem={addNewMediaItem} />
      <MediaList mediaItems={mediaItems} setMediaItems={setMediaItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
