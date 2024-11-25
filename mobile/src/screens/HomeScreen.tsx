import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllMedia } from "../api";
import MediaList from "../components/MediaList";
import UploadIcon from "../components/UploadIcon";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../components/LogoutButton";

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
  created_by: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setIsAuthenticated }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getAllMedia();
        setMediaItems(mediaData);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    const fetchCurrentUser = async () => {
      const user = await AsyncStorage.getItem("username");
      if (user) {
        setCurrentUser(user);
      }
    };

    fetchMedia();
    fetchCurrentUser();
  }, []);

  const handleLogout = React.useCallback(async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  const addNewMediaItem = (newMedia: MediaItem) => {
    setMediaItems((prevItems) => [...prevItems, newMedia]);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton onPress={handleLogout} />,
    });
  }, [navigation, handleLogout]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {currentUser}</Text>
      <MediaList
        mediaItems={mediaItems}
        setMediaItems={setMediaItems}
        currentUser={currentUser}
      />
      <UploadIcon addNewMediaItem={addNewMediaItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default HomeScreen;
