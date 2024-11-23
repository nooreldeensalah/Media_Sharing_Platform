import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { likeMedia, unlikeMedia } from "../api";

interface MediaItem {
  id: number;
  file_name: string;
  url: string;
  mimetype: string;
  likes: number;
}

interface MediaListProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

const MediaList: React.FC<MediaListProps> = ({ mediaItems, setMediaItems }) => {
  const handleLike = async (id: number) => {
    try {
      await likeMedia(id);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: item.likes + 1 } : item,
        ),
      );
    } catch (error) {
      console.error("Error liking media:", error);
    }
  };

  const handleUnlike = async (id: number) => {
    try {
      await unlikeMedia(id);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: item.likes - 1 } : item,
        ),
      );
    } catch (error) {
      console.error("Error unliking media:", error);
    }
  };

  return (
    <FlatList
      data={mediaItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.mediaItem}>
          {item.mimetype.startsWith("video") ? (
            <Text style={styles.mediaText}>Video: {item.file_name}</Text>
          ) : (
            <Image source={{ uri: item.url }} style={styles.mediaImage} />
          )}
          <Text style={styles.mediaTitle}>{item.file_name}</Text>
          <Text style={styles.mediaLikes}>Likes: {item.likes}</Text>
          <View style={styles.mediaActions}>
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <Text style={styles.likeButton}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnlike(item.id)}>
              <Text style={styles.unlikeButton}>Unlike</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  mediaItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  mediaText: {
    color: "gray",
  },
  mediaImage: {
    width: "100%",
    height: 160,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  mediaLikes: {
    color: "gray",
  },
  mediaActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  likeButton: {
    color: "blue",
  },
  unlikeButton: {
    color: "red",
  },
});

export default MediaList;
