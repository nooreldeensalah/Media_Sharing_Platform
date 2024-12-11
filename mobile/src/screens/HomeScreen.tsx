import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllMedia } from "../api";
import MediaList from "../components/MediaList";
import UploadIcon from "../components/UploadIcon";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../components/LogoutButton";
import { FlatList } from "react-native";
import { NavigationProp, MediaItem } from "../types";
import { HomeScreenProps } from "../types";

const HomeScreen: React.FC<HomeScreenProps> = ({ setIsAuthenticated }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const navigation = useNavigation<NavigationProp>();
  const listRef = useRef<FlatList>(null);

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

  // NOTE: `flushSync` isn't available in React Native
  // So instead of using `UseEffect` which I believe should be reserved for external side effects (not user events)
  // I will use the setTimeOut solution here, probably not the most elegant solution but it works
  const addNewMediaItem = (newMedia: MediaItem) => {
    setMediaItems((prevItems) => {
      const updatedItems = [...prevItems, newMedia];
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 0);
      return updatedItems;
    });
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
        listRef={listRef}
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
