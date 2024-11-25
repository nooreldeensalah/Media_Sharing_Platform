import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { likeMedia, unlikeMedia, deleteMedia } from "../api";
import { FontAwesome } from "@expo/vector-icons";

interface MediaItem {
  id: number;
  file_name: string;
  url: string;
  mimetype: string;
  likes: number;
  likedByUser: boolean;
  created_by: string;
}

interface MediaListProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  currentUser: string;
}

const MediaList: React.FC<MediaListProps> = ({
  mediaItems,
  setMediaItems,
  currentUser,
}) => {
  const handleLike = async (id: number) => {
    try {
      await likeMedia(id);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, likes: item.likes + 1, likedByUser: true }
            : item,
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
          item.id === id
            ? { ...item, likes: item.likes - 1, likedByUser: false }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error unliking media:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedia(id);
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this media item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
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
            <TouchableOpacity
              onPress={() =>
                item.likedByUser ? handleUnlike(item.id) : handleLike(item.id)
              }
            >
              <FontAwesome
                name={item.likedByUser ? "heart" : "heart-o"}
                size={24}
                color={item.likedByUser ? "red" : "gray"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                item.created_by === currentUser && confirmDelete(item.id)
              }
              disabled={item.created_by !== currentUser}
            >
              <FontAwesome
                name="trash"
                size={24}
                color={item.created_by === currentUser ? "red" : "gray"}
              />
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
});

export default MediaList;
