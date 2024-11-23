import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
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
        <View
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: "white",
          }}
        >
          {item.mimetype.startsWith("video") ? (
            <Text style={{ color: "gray" }}>Video: {item.file_name}</Text>
          ) : (
            <Image
              source={{ uri: item.url }}
              style={{ width: "100%", height: 160 }}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
            {item.file_name}
          </Text>
          <Text style={{ color: "gray" }}>Likes: {item.likes}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <Text style={{ color: "blue" }}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnlike(item.id)}>
              <Text style={{ color: "red" }}>Unlike</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

export default MediaList;
