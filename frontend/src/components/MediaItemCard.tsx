import React from 'react';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { MediaItem } from '../types';

interface MediaItemCardProps {
  item: MediaItem;
  handleLike: (id: number) => void;
  handleUnlike: (id: number) => void;
  confirmDelete: (id: number) => void;
}

const MediaItemCard: React.FC<MediaItemCardProps> = ({ item, handleLike, handleUnlike, confirmDelete }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative bg-white group">
      {item.mimetype.startsWith("video") ? (
        <video controls className="w-full h-48 object-contain" src={item.url} />
      ) : (
        <img alt={item.file_name} className="w-full h-48 object-contain" src={item.url} />
      )}
      <div className="p-4">
        <p className="text-sm text-gray-500">Uploaded by: {item.created_by}</p>
        <p className="text-sm text-gray-500">Uploaded on: {new Date(item.created_at).toLocaleDateString()}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => (item.likedByUser ? handleUnlike(item.id) : handleLike(item.id))}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition"
            >
              {item.likedByUser ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{item.likes}</span>
            </button>
          </div>
          <button
            onClick={() => confirmDelete(item.id)}
            className="flex items-center text-red-500 hover:text-red-700 transition"
          >
            <FaTrash className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaItemCard;
