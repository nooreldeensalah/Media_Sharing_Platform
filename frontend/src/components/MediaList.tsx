import React from 'react';
import { deleteMedia, likeMedia, unlikeMedia } from '../api';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

interface MediaItem {
  id: number;
  file_name: string;
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  likedByUser: boolean;
}

interface MediaListProps {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

const MediaList: React.FC<MediaListProps> = ({ mediaItems, setMediaItems }) => {
  const handleLike = async (id: number) => {
    try {
      await likeMedia(id);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: item.likes + 1, likedByUser: true } : item
        )
      );
    } catch (error) {
      console.error('Error liking media:', error);
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
      console.error('Error unliking media:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteMedia(id);
      if (response?.message) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mediaItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative bg-white group"
        >
          {item.mimetype.startsWith('video') ? (
            <video controls className="w-full h-48 object-contain" src={item.url} />
          ) : (
            <img
              alt={item.file_name}
              className="w-full h-48 object-contain"
              src={item.url}
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{item.file_name}</h3>
            <p className="text-sm text-gray-500">
              Uploaded on: {new Date(item.created_at).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    item.likedByUser ? handleUnlike(item.id) : handleLike(item.id)
                  }
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition"
                >
                  {item.likedByUser ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{item.likes}</span>
                </button>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center text-red-500 hover:text-red-700 transition"
              >
                <FaTrash className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaList;
