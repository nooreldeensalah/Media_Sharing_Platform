import { FastifyInstance } from 'fastify';
import {
  MediaItem,
  PaginatedMediaResponse,
  DatabaseMediaItem,
  MediaItemWithUserInfo,
  ServiceError,
  ToggleLikeResponse,
  DeleteMediaResponse,
  UploadUrlResponse
} from '../types';
import { addCanonicalUrlsToMediaItems, generateCanonicalUrl } from '../utils/urlGenerator';

export class MediaService {
  constructor(private fastify: FastifyInstance) {}

  async getMediaById(id: number, userId: number, username: string): Promise<MediaItem> {
    const row = this.fastify.sqlite.prepare(`
      SELECT media.*, users.username,
        CASE WHEN likes.user_id IS NOT NULL THEN 1 ELSE 0 END AS likedByUser,
        CASE WHEN media.created_by = ? THEN 1 ELSE 0 END AS deletable
      FROM media
      LEFT JOIN likes ON media.id = likes.media_id AND likes.user_id = ?
      LEFT JOIN users ON media.created_by = users.username
      WHERE media.id = ?
    `).get(username, userId, id) as MediaItemWithUserInfo | undefined;

    if (!row) {
      const error = new Error('Media not found') as ServiceError;
      error.statusCode = 404;
      throw error;
    }

    return {
      ...row,
      url: generateCanonicalUrl(row.file_name)
    };
  }

  async getAllMediaPaginated(
    page: number,
    limit: number,
    userId: number,
    username: string,
    filterUser?: string,
    search?: string
  ): Promise<PaginatedMediaResponse> {
    if (page < 1) {
      const error = new Error('Page must be a positive integer') as ServiceError;
      error.statusCode = 400;
      throw error;
    }

    if (limit < 1 || limit > 100) {
      const error = new Error('Limit must be between 1 and 100') as ServiceError;
      error.statusCode = 400;
      throw error;
    }

    const offset = (page - 1) * limit;

    // Build WHERE clause conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (filterUser) {
      conditions.push('media.created_by = ?');
      params.push(filterUser);
    }

    if (search) {
      conditions.push('(media.original_filename LIKE ? OR media.file_name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalCount = this.fastify.sqlite.prepare(`
      SELECT COUNT(*) as total FROM media ${whereClause}
    `).get(...params) as { total: number };

    const rows = this.fastify.sqlite.prepare(`
      SELECT media.*, users.username,
        CASE WHEN likes.user_id IS NOT NULL THEN 1 ELSE 0 END AS likedByUser,
        CASE WHEN media.created_by = ? THEN 1 ELSE 0 END AS deletable
      FROM media
      LEFT JOIN likes ON media.id = likes.media_id AND likes.user_id = ?
      LEFT JOIN users ON media.created_by = users.username
      ${whereClause}
      ORDER BY media.created_at DESC, media.id DESC
      LIMIT ? OFFSET ?
    `).all(username, userId, ...params, limit, offset) as MediaItemWithUserInfo[];

    const totalPages = Math.ceil(totalCount.total / limit);

    return {
      data: addCanonicalUrlsToMediaItems(rows),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount.total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  async toggleLike(mediaId: number, userId: number, action: 'like' | 'unlike'): Promise<ToggleLikeResponse> {
    const mediaExists = this.fastify.sqlite.prepare('SELECT id, likes FROM media WHERE id = ?').get(mediaId);
    if (!mediaExists) {
      const error = new Error('Media not found') as ServiceError;
      error.statusCode = 404;
      throw error;
    }

    const likeExists = this.fastify.sqlite.prepare('SELECT 1 FROM likes WHERE user_id = ? AND media_id = ?').get(userId, mediaId);

    if (action === 'like') {
      if (likeExists) {
        const error = new Error('You have already liked this media') as ServiceError;
        error.statusCode = 400;
        throw error;
      }

      const updateStmt = this.fastify.sqlite.prepare('UPDATE media SET likes = likes + 1 WHERE id = ?');
      updateStmt.run(mediaId);
      this.fastify.sqlite.prepare('INSERT INTO likes (user_id, media_id) VALUES (?, ?)').run(userId, mediaId);
    } else {
      if (!likeExists) {
        const error = new Error('You have not liked this media') as ServiceError;
        error.statusCode = 400;
        throw error;
      }

      const updateStmt = this.fastify.sqlite.prepare('UPDATE media SET likes = likes - 1 WHERE id = ?');
      updateStmt.run(mediaId);
      this.fastify.sqlite.prepare('DELETE FROM likes WHERE user_id = ? AND media_id = ?').run(userId, mediaId);
    }

    const updatedMedia = this.fastify.sqlite.prepare('SELECT likes FROM media WHERE id = ?').get(mediaId) as { likes: number };

    return {
      message: `File with ID: ${mediaId} ${action === 'like' ? 'liked' : 'unliked'} successfully!`,
      action: action === 'like' ? 'liked' : 'unliked',
      newLikeCount: updatedMedia.likes
    };
  }

  async deleteMedia(id: number, userId: number, username: string): Promise<DeleteMediaResponse> {
    const row = this.fastify.sqlite.prepare('SELECT * FROM media WHERE id = ?').get(id) as DatabaseMediaItem | undefined;

    if (!row) {
      const error = new Error('Media not found') as ServiceError;
      error.statusCode = 404;
      throw error;
    }

    if (row.created_by !== username) {
      const error = new Error('You do not have permission to delete this file') as ServiceError;
      error.statusCode = 403;
      throw error;
    }

    try {
      await this.fastify.s3Service.deleteFile(row.file_name);
    } catch (error) {
      const serviceError = error as ServiceError;
      if (serviceError.statusCode !== 404) {
        throw error;
      }
    }

    const deleteResult = this.fastify.sqlite.prepare('DELETE FROM media WHERE id = ?').run(id);

    if (deleteResult.changes === 0) {
      const error = new Error('Failed to delete media from database') as ServiceError;
      error.statusCode = 500;
      throw error;
    }

    return {
      message: 'File deleted successfully'
    };
  }

  async notifyUpload(fileName: string, mimeType: string, username: string, originalFilename?: string): Promise<MediaItem> {
    try {
      await this.fastify.s3Service.verifyFileExists(fileName);

      const stmt = this.fastify.sqlite.prepare('INSERT INTO media (file_name, original_filename, likes, created_at, mimetype, created_by) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(fileName, originalFilename || null, 0, new Date().toISOString(), mimeType, username);

      const canonicalUrl = generateCanonicalUrl(fileName);

      return {
        id: info.lastInsertRowid as number,
        file_name: fileName,
        likes: 0,
        url: canonicalUrl,
        created_at: new Date().toISOString(),
        mimetype: mimeType,
        created_by: username,
        deletable: true,
        likedByUser: false
      };
    } catch (error) {
      const serviceError = error as ServiceError;
      if (serviceError.statusCode === 404) {
        const newError = new Error('File not found in S3 storage') as ServiceError;
        newError.statusCode = 404;
        throw newError;
      }
      if (serviceError.statusCode) {
        throw error;
      }
      const newServiceError = new Error('Failed to save media metadata') as ServiceError;
      newServiceError.statusCode = 500;
      throw newServiceError;
    }
  }

  async generateUploadUrl(fileName: string, mimeType: string): Promise<UploadUrlResponse> {
    try {
      const url = await this.fastify.s3Service.generatePreSignedPutUrl(fileName, mimeType);
      return { url };
    } catch (error) {
      const serviceError = error as ServiceError;
      if (serviceError.statusCode) {
        throw error;
      }
      const newServiceError = new Error('Failed to generate upload URL') as ServiceError;
      newServiceError.statusCode = 500;
      throw newServiceError;
    }
  }
}
