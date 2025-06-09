import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { deleteMedia, toggleLike } from "../api";
import MediaItemCard from "./MediaItemCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Pagination from "./Pagination";
import { LoadingSpinner, MediaCardSkeleton } from "./ui/Loading";
import { Button } from "./ui/Button";
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
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Scroll to upload section instead of very top
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Loading skeleton for better UX
  if (isLoading && mediaItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {t('media.gallery')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <MediaCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent mb-2">
          {t('media.gallery')}
        </h2>
        {pagination && (
          <p className="text-gray-600 dark:text-gray-400">
            {t('pagination.page', { current: pagination.currentPage, total: pagination.totalPages })}
          </p>
        )}
      </motion.div>

      {/* Top pagination */}
      {pagination && onPageChange && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </motion.div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Media Grid */}
      <AnimatePresence mode="wait">
        {mediaItems.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('media.noMedia')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('media.startUploading')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                ref={index === mediaItems.length - 1 ? lastItemRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <MediaItemCard
                  item={item}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  confirmDelete={confirmDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom pagination */}
      {pagination && onPageChange && mediaItems.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              variant="primary"
              size="sm"
              className="rounded-full p-3 shadow-lg"
              aria-label={t('general.scrollToTop')}
              title={t('general.scrollToTop')}
            >
              <ArrowUpIcon className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MediaList;
