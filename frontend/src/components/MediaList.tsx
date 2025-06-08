import React, { useState, useEffect } from "react";
import { deleteMedia, toggleLike } from "../api";
import MediaItemCard from "./MediaItemCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Pagination from "./Pagination";
import { MediaListProps } from "../types";

const MediaList: React.FC<MediaListProps> = ({
  mediaItems,
  setMediaItems,
  lastItemRef,
  pagination,
  setPagination,
  onPageChange,
  isLoading = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = async (id: number) => {
    try {
      const response = await toggleLike(id, 'like');
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, likes: response.newLikeCount, likedByUser: true }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error liking media:", error);
    }
  };

  const handleUnlike = async (id: number) => {
    try {
      const response = await toggleLike(id, 'unlike');
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, likes: response.newLikeCount, likedByUser: false }
            : item,
        ),
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
        setMediaItems((prev) =>
          prev.filter((item) => item.id !== selectedItemId),
        );

        // Update pagination to reflect the deleted item
        if (setPagination && pagination) {
          setPagination((prevPagination) => {
            if (prevPagination) {
              const newTotalItems = prevPagination.totalItems - 1;
              return {
                ...prevPagination,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / prevPagination.itemsPerPage)
              };
            }
            return prevPagination;
          });
        }

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
      {/* Top pagination and loading indicator */}
      {pagination && onPageChange && (
        <div className="mb-4">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-4">
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

      {/* Bottom pagination */}
      {pagination && onPageChange && (
        <div className="mt-4">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </div>
      )}

      <DeleteConfirmationModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default MediaList;
