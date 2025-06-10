import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  HeartIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Button } from "./ui/Button";
import { MediaItemCardProps } from "../types";
import { generateMediaAlt, getMediaType } from "../utils";
import { useRelativeTime } from "../hooks/useRelativeTime";

const MediaItemCard: React.FC<MediaItemCardProps> = ({
  item,
  handleLike,
  handleUnlike,
  confirmDelete,
  onUserFilter,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();
  const formatRelativeTime = useRelativeTime();

  const mediaType = getMediaType(item.mimetype);
  const altText = generateMediaAlt(item.file_name, item.mimetype);

  const handleMediaClick = () => {
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      layout
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700 card-hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Media Content - Make it taller for larger cards */}
      <div
        className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer group"
        onClick={handleMediaClick}
      >
        {mediaType === "video" ? (
          <video
            controls
            className="w-full h-full object-cover"
            src={item.url}
            aria-label={t("a11y.mediaVideo", { filename: item.file_name })}
            preload="metadata"
            onClick={(e) => e.stopPropagation()} // Prevent opening in new tab when using video controls
          />
        ) : (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
              </div>
            )}
            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-600">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-2">
                  {t("media.failedToLoad")}
                </span>
              </div>
            ) : (
              <img
                alt={altText}
                className={`media-image transition-all duration-300 ${
                  imageLoaded ? "loaded opacity-100" : "loading opacity-0"
                } group-hover:scale-105`}
                src={item.url}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            )}
          </>
        )}

        {/* Open in new tab indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-5">
        {/* User info */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-base">
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <UserIcon className="h-4 w-4" />
            </div>
            <button
              onClick={() => onUserFilter?.(item.created_by)}
              className="text-gray-900 dark:text-white font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 cursor-pointer underline decoration-transparent hover:decoration-current"
              aria-label={t("media.filterByUser", {
                username: item.created_by,
              })}
            >
              {item.created_by}
            </button>
          </div>
        </div>

        {/* Filename */}
        {item.original_filename && (
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-base">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-600 dark:text-gray-400 min-w-0 flex-1">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full flex-shrink-0">
                <DocumentIcon className="h-4 w-4" />
              </div>
              <span className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded min-w-0 flex-1 truncate">
                {item.original_filename}
              </span>
            </div>
          </div>
        )}

        {/* Date info */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-base">
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <span className="text-gray-900 dark:text-white">
              {formatRelativeTime(item.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              item.likedByUser ? handleUnlike(item.id) : handleLike(item.id)
            }
            className="flex items-center space-x-3 rtl:space-x-reverse text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label={
              item.likedByUser ? t("a11y.unlikeButton") : t("a11y.likeButton")
            }
          >
            {item.likedByUser ? (
              <HeartSolidIcon className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
            <span className="font-medium text-base">
              {item.likes} {t("media.likes")}
            </span>
          </motion.button>

          {item.deletable && (
            <Button
              onClick={() => confirmDelete(item.id)}
              variant="ghost"
              size="md"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              aria-label={t("a11y.deleteButton")}
            >
              <TrashIcon className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("media.delete")}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MediaItemCard;
