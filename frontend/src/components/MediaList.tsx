import React, { useState } from "react";
import { deleteMedia, likeMedia, unlikeMedia } from "../api";
import MediaItemCard from "./MediaItemCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { MediaListProps } from "../types";

const MediaList: React.FC<MediaListProps> = ({ mediaItems, setMediaItems, lastItemRef }) => {
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
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-20">
        {mediaItems.map((item, index) => (
          <div
            key={item.id}
            ref={index === mediaItems.length - 1 ? lastItemRef : null}
          >
            <MediaItemCard
              item={item}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              confirmDelete={confirmDelete}
            />
          </div>
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
