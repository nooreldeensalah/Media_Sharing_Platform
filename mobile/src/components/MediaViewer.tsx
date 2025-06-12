import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
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

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
});
