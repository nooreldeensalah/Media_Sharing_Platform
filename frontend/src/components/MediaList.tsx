import React, { useEffect, useState } from 'react';
import { getAllMedia, likeMedia, unlikeMedia } from '../api';

interface MediaItem {
    id: number;
    file_name: string;
    likes: number;
    url: string;
    created_at: string;
    mimetype: string;
}

const MediaList: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const media = await getAllMedia();
                setMediaItems(media);
            } catch (error) {
                console.error('Error fetching media:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const handleLike = async (fileName: string) => {
        try {
            await likeMedia(fileName);
            setMediaItems((prev) =>
                prev.map((item) =>
                    item.file_name === fileName ? { ...item, likes: item.likes + 1 } : item
                )
            );
        } catch (error) {
            console.error('Error liking media:', error);
        }
    };

    const handleUnlike = async (fileName: string) => {
        try {
            await unlikeMedia(fileName);
            setMediaItems((prev) =>
                prev.map((item) =>
                    item.file_name === fileName ? { ...item, likes: item.likes - 1 } : item
                )
            );
        } catch (error) {
            console.error('Error unliking media:', error);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (mediaItems.length === 0) {
        return <p className="text-center text-gray-500">No media items found.</p>;
    }

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaItems.map((item) => (
                <div
                    key={item.id}
                    className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
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
                                <button
                                    onClick={() => handleLike(item.file_name)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Like
                                </button>
                                <button
                                    onClick={() => handleUnlike(item.file_name)}
                                    className="text-red-500 hover:underline"
                                >
                                    Unlike
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
