import React, { useState } from "react";
import { deleteMedia, likeMedia, unlikeMedia } from "../api";
import MediaItemCard from "./MediaItemCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { MediaItem } from "../types";

interface MediaListProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

const MediaList: React.FC<MediaListProps> = ({ mediaItems, setMediaItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleLike = async (id: number) => {
    try {
      await likeMedia(id);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: item.likes + 1, likedByUser: true } : item
        )
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
          item.id === id ? { ...item, likes: item.likes - 1, likedByUser: false } : item
        )
      );
    } catch (error) {
      console.error("Error unliking media:", error);
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedItemId === null) return;
    try {
      const response = await deleteMedia(selectedItemId);
      if (response?.message) {
        setMediaItems((prev) => prev.filter((item) => item.id !== selectedItemId));
        setShowModal(false);
        setSelectedItemId(null);
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <MediaItemCard
            key={item.id}
            item={item}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            confirmDelete={confirmDelete}
          />
        ))}
      </div>
      <DeleteConfirmationModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default MediaList;
