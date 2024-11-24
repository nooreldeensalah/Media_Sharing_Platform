import React from 'react';
import { deleteMedia, likeMedia, unlikeMedia } from '../api';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

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
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {mediaItems.map((item) => (
        <div key={item.id} className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
          {item.mimetype.startsWith('video') ? (
            <video controls className="w-full h-48 object-cover" src={item.url} />
          ) : (
            <img alt={item.file_name} className="w-full h-48 object-cover" src={item.url} />
          )}
          <div className="p-2">
            <p className="text-gray-700 font-medium">{item.file_name}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600 text-sm">{item.likes} Likes</span>
              <div className="space-x-2">
                {item.likedByUser ? (
                  <FaHeart className="text-red-500 cursor-pointer" onClick={() => handleUnlike(item.id)} />
                ) : (
                  <FaRegHeart className="text-gray-500 cursor-pointer" onClick={() => handleLike(item.id)} />
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaList;
