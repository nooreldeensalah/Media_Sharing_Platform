import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { MediaItem } from "../types";

interface MediaViewerProps {
  visible: boolean;
  item: MediaItem | null;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const MediaViewer: React.FC<MediaViewerProps> = ({
  visible,
  item,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isVideo = item?.mimetype.startsWith("video/");

  const videoUrl = React.useMemo(() => {
    return isVideo && item && visible ? `${item.url}?t=${Date.now()}` : "";
  }, [isVideo, item, visible]);

  const player = useVideoPlayer(videoUrl, (player) => {
    if (isVideo && visible) {
      player.loop = false;
      player.muted = false;
      player.playbackRate = 1.0;
    }
  });

  React.useEffect(() => {
    if (visible && item) {
      setIsLoading(Boolean(isVideo));

      if (isVideo && player) {
        // Auto-play video when media viewer opens
        player.play();
        const timeout = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timeout);
      } else {
        setIsLoading(false);
      }
    }

    if (!visible && isVideo && player) {
      // Pause video when modal closes
      player.pause();
      setIsLoading(false);
    }
  }, [visible, item, isVideo, player]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const handleShare = React.useCallback(async () => {
    if (!item) return;
    try {
      await Share.share({
        url: item.url,
        message: `Check out this ${isVideo ? "video" : "image"}: ${
          item.original_filename || item.file_name
        }`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [item, isVideo]);

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <View style={styles.container}>
        <View style={styles.gestureContainer}>
          {/* Media Content */}
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <VideoView
                style={styles.media}
                player={player}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                nativeControls={true}
                contentFit="contain" // Added contentFit
              />
            ) : (
              <Image
                source={{ uri: item.url }}
                style={styles.media}
                contentFit="contain"
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                placeholder={{ blurhash: "LKN]Rv%2Tw=w]~RBVZRi};RPxuwH" }}
              />
            )}
          </View>

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {/* Top Controls - Always visible for close button */}
          <View style={styles.topControls}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.controlButton}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={styles.controlButton}
            >
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  gestureContainer: {
    flex: 1,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width: screenWidth,
    height: screenHeight,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  topControls: {
    position: "absolute",
    top: 44, // Consider using SafeAreaView or equivalent for better positioning
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.0)", // Making controls background transparent
  },
  controlButton: {
    padding: 8,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
