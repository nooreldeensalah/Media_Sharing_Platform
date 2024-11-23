import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { getAllMedia } from "../api";
import MediaList from "../components/MediaList";
import UploadMedia from "../components/UploadMedia";

const HomeScreen: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const media = await getAllMedia();
        setMediaItems(media);
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 16 }}>
      <UploadMedia
        addNewMediaItem={(item) => setMediaItems([...mediaItems, item])}
      />
      <MediaList mediaItems={mediaItems} setMediaItems={setMediaItems} />
    </View>
  );
};

export default HomeScreen;
