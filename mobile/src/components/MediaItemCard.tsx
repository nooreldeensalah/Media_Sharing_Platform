import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Pressable,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { useToast } from "../contexts/ToastContext";
import { ConfirmModal } from "./ui/ConfirmModal";
import { MediaViewer } from "./MediaViewer";
import { MediaItem } from "../types";
import {
  formatTextWithNumbers,
  formatNumber,
  getFlexDirection,
} from "../utils/numberUtils";

interface MediaItemCardProps {
  item: MediaItem;
  currentUser: { id: number; email: string };
  onToggleLike: (id: number, isLiked: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

const MediaItemCard: React.FC<MediaItemCardProps> = React.memo(
  ({ item, currentUser, onToggleLike, onDelete }) => {
    const { colorScheme } = useTheme();
    const colors = getColors(colorScheme);
    const { t, i18n } = useTranslation();
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMediaViewer, setShowMediaViewer] = useState(false);

    const isVideo = item.mimetype.startsWith("video/");
    const player = useVideoPlayer(isVideo ? item.url : "", (player) => {
      if (isVideo) {
        player.loop = false;
        player.muted = true;
      }
    });

    const isOwner =
      (item.user && item.user.id === currentUser.id) ||
      item.created_by === currentUser.email;

    const formatDate = useCallback(
      (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);

        if (minutes < 1) return t("justNow");
        if (minutes < 60) {
          const text = t("minutesAgo", { count: minutes });
          return formatTextWithNumbers(text, i18n.language);
        }
        if (hours < 24) {
          const text = t("hoursAgo", { count: hours });
          return formatTextWithNumbers(text, i18n.language);
        }
        if (days === 1) return t("yesterday");
        if (days < 7) {
          const text = t("daysAgo", { count: days });
          return formatTextWithNumbers(text, i18n.language);
        }
        if (weeks < 4) {
          const text = t("weeksAgo", { count: weeks });
          return formatTextWithNumbers(text, i18n.language);
        }
        return date.toLocaleDateString();
      },
      [t, i18n.language],
    );

    const handleLikeToggle = useCallback(async () => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        await onToggleLike(item.id, item.likedByUser);
      } catch {
        toast.error(t("error"), t("likeUpdateFailed"));
      } finally {
        setIsLoading(false);
      }
    }, [isLoading, onToggleLike, item.id, item.likedByUser, toast, t]);

    const handleMediaPress = useCallback(() => {
      setShowMediaViewer(true);
    }, []);

    const handleMediaLongPress = useCallback(() => {
      Linking.openURL(item.url);
    }, [item.url]);

    const handleExternalOpen = useCallback(() => {
      Linking.openURL(item.url);
    }, [item.url]);

    const handleDelete = useCallback(() => {
      setShowDeleteModal(true);
    }, []);

    const handleShare = useCallback(async () => {
      try {
        await Share.share({
          url: item.url,
          message: `Check out this ${isVideo ? "video" : "image"}: ${item.url}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error(t("error"), t("shareFailed"));
      }
    }, [item, isVideo, toast, t]);

    const confirmDelete = useCallback(async () => {
      setShowDeleteModal(false);
      try {
        await onDelete(item.id);
        toast.success(t("success"), t("mediaDeletedSuccessfully"));
      } catch {
        toast.error(t("error"), t("deleteMediaFailed"));
      }
    }, [onDelete, item.id, toast, t]);

    const getFileIcon = useCallback((mimetype: string) => {
      if (mimetype.startsWith("video/")) return "play-circle";
      if (mimetype.startsWith("image/")) return "image";
      if (mimetype.includes("pdf")) return "document-text";
      return "document";
    }, []);

    return (
      <>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Pressable
            onPress={handleMediaPress}
            onLongPress={handleMediaLongPress}
            style={styles.mediaContainer}
          >
            {isVideo ? (
              <VideoView
                style={styles.media}
                player={player}
                allowsFullscreen
                allowsPictureInPicture={false}
                nativeControls={false}
              />
            ) : (
              <Image
                source={{ uri: item.url }}
                style={styles.media}
                contentFit="contain"
                onError={() => setImageError(true)}
                placeholder={{ blurhash: "LKN]Rv%2Tw=w]~RBVZRi};RPxuwH" }}
                transition={200}
              />
            )}

            <View
              style={[
                styles.overlayTop,
                { flexDirection: getFlexDirection(i18n.language) },
              ]}
            >
              <View
                style={[
                  styles.typeIcon,
                  { backgroundColor: colors.surface + "E6" },
                ]}
              >
                <Ionicons
                  name={getFileIcon(item.mimetype)}
                  size={14}
                  color={colors.text}
                />
              </View>
              <TouchableOpacity
                style={styles.externalIcon}
                onPress={handleExternalOpen}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="open-outline" size={12} color="white" />
              </TouchableOpacity>
            </View>

            {imageError && (
              <View style={styles.errorOverlay}>
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
            )}
          </Pressable>

          <View style={styles.content}>
            <View
              style={[
                styles.topRow,
                { flexDirection: getFlexDirection(i18n.language) },
              ]}
            >
              <View
                style={[
                  styles.userInfo,
                  { flexDirection: getFlexDirection(i18n.language) },
                ]}
              >
                <Ionicons
                  name="person-circle"
                  size={16}
                  color={colors.primary}
                />
                <Text
                  style={[styles.userName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.created_by}
                </Text>
              </View>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {formatDate(item.created_at)}
              </Text>
            </View>

            {item.original_filename && (
              <Text
                style={[styles.filename, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.original_filename}
              </Text>
            )}

            <View
              style={[
                styles.actions,
                { flexDirection: getFlexDirection(i18n.language) },
              ]}
            >
              <TouchableOpacity
                onPress={handleLikeToggle}
                style={[
                  styles.likeButton,
                  {
                    backgroundColor: item.likedByUser
                      ? colors.primary + "20"
                      : "transparent",
                    flexDirection: getFlexDirection(i18n.language),
                  },
                ]}
                disabled={isLoading}
              >
                <Ionicons
                  name={item.likedByUser ? "heart" : "heart-outline"}
                  size={18}
                  color={
                    item.likedByUser ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.likeCount,
                    {
                      color: item.likedByUser
                        ? colors.primary
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {formatNumber(item.likes, i18n.language)}
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.actionButtons,
                  { flexDirection: getFlexDirection(i18n.language) },
                ]}
              >
                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.shareButton}
                >
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {isOwner && (
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        <ConfirmModal
          visible={showDeleteModal}
          title={t("delete")}
          message={t("deleteConfirm")}
          confirmText={t("delete")}
          cancelText={t("cancel")}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmButtonColor="#FF4444"
          icon="trash"
        />

        <MediaViewer
          visible={showMediaViewer}
          item={item}
          onClose={() => setShowMediaViewer(false)}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.likes === nextProps.item.likes &&
      prevProps.item.likedByUser === nextProps.item.likedByUser &&
      prevProps.currentUser.email === nextProps.currentUser.email
    );
  },
);

MediaItemCard.displayName = "MediaItemCard";

export { MediaItemCard };

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 24,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  mediaContainer: {
    position: "relative",
    width: "100%",
    height: CARD_HEIGHT,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  overlayTop: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeIcon: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  externalIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 4,
    borderRadius: 8,
  },
  errorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  content: {
    padding: 12,
    gap: 8,
  },
  topRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  filename: {
    fontSize: 11,
    fontFamily: "monospace",
    marginTop: -4,
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  likeButton: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 32,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  shareButton: {
    padding: 6,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
  },
});
