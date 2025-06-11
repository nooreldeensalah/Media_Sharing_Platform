import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MediaItemCard } from "./MediaItemCard";
import { toggleLike, deleteMedia } from "../api";
import { MediaListProps, MediaItem } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";

const MediaList: React.FC<MediaListProps> = ({
  mediaItems,
  setMediaItems,
  currentUser,
  listRef,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t } = useTranslation();

  const handleToggleLike = React.useCallback(
    async (id: number, isLiked: boolean) => {
      // Optimistically update UI first for better UX
      const likeIncrement = isLiked ? -1 : 1;

      // Update the full mediaItems array (not just the visible paginated items)
      setMediaItems((prev: MediaItem[]) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                likes: Math.max(0, item.likes + likeIncrement),
                likedByUser: !isLiked,
              }
            : item,
        ),
      );

      try {
        const action = isLiked ? "unlike" : "like";
        const response = await toggleLike(id, action);

        // Sync with server response using the action (not the original isLiked)
        setMediaItems((prev: MediaItem[]) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  likes: response.newLikeCount,
                  likedByUser: action === "like",
                }
              : item,
          ),
        );
      } catch {
        // Revert optimistic update on error
        setMediaItems((prev: MediaItem[]) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  likes: Math.max(0, item.likes - likeIncrement),
                  likedByUser: isLiked,
                }
              : item,
          ),
        );
        throw new Error("Failed to toggle like");
      }
    },
    [setMediaItems],
  );

  const handleDelete = React.useCallback(
    async (id: number) => {
      // Find the item in the current mediaItems prop (might be paginated)
      // but we need to search in the full array for deletion
      let itemToDelete: MediaItem | undefined;

      // Update the full mediaItems array and find the item to delete
      setMediaItems((prev: MediaItem[]) => {
        itemToDelete = prev.find((item) => item.id === id);
        return prev.filter((item) => item.id !== id);
      });

      try {
        await deleteMedia(id);
        // Success - item already removed from UI
      } catch {
        // Revert optimistic update on error
        if (itemToDelete) {
          setMediaItems((prev: MediaItem[]) => [itemToDelete!, ...prev]);
        }
        throw new Error("Failed to delete media");
      }
    },
    [setMediaItems],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: MediaItem }) => (
      <MediaItemCard
        item={item}
        currentUser={{ id: 0, email: currentUser }}
        onToggleLike={handleToggleLike}
        onDelete={handleDelete}
      />
    ),
    [currentUser, handleToggleLike, handleDelete],
  );

  const getItemLayout = React.useCallback(
    (_: any, index: number) => ({
      length: 280, // Approximate height of MediaItemCard
      offset: 280 * index,
      index,
    }),
    [],
  );

  const keyExtractor = React.useCallback(
    (item: MediaItem) => item.id.toString(),
    [],
  );

  const renderEmpty = () => (
    <View
      style={[styles.emptyContainer, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {t("noMediaFound")}
      </Text>
    </View>
  );

  return (
    <FlatList
      ref={listRef}
      data={mediaItems}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={[
        styles.listContent,
        mediaItems.length === 0 ? styles.emptyList : null,
      ]}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={100}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
    paddingBottom: 60,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
});

export default React.memo(MediaList);
