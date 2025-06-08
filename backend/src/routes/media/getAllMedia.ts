import { FastifyPluginAsync } from 'fastify'

const getAllMediaSchema = {
  "tags": ["media"],
  "summary": "Get all media files with pagination",
  "querystring": {
    "type": "object",
    "properties": {
      "page": { "type": "integer", "minimum": 1, "default": 1 },
      "limit": { "type": "integer", "minimum": 1, "maximum": 100, "default": 10 }
    }
  },
  "response": {
    "200": {
      "description": "Paginated list of media files",
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer"
              },
              "file_name": {
                "type": "string"
              },
              "likes": {
                "type": "integer"
              },
              "url": {
                "type": "string"
              },
              "created_at": {
                "type": "string",
                "format": "date-time"
              },
              "mimetype": {
                "type": "string"
              },
              "likedByUser": {
                "type": "boolean"
              },
              "created_by": {
                "type": "string"
              },
              "deletable": {
                "type": "boolean"
              }
            }
          }
        },
        "pagination": {
          "type": "object",
          "properties": {
            "currentPage": { "type": "integer" },
            "totalPages": { "type": "integer" },
            "totalItems": { "type": "integer" },
            "itemsPerPage": { "type": "integer" },
            "hasNextPage": { "type": "boolean" },
            "hasPreviousPage": { "type": "boolean" }
          }
        }
      }
    },
    "400": {
      "description": "Invalid pagination parameters",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "204": {
      "description": "No media files found",
      "type": "null"
    },
    "500": {
      "description": "Error fetching media files",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const getAllMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', { schema: getAllMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.id;
    const username = request.user.username;
    const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };

    // Validate pagination parameters
    if (page < 1) {
      return reply.badRequest('Page must be a positive integer');
    }
    if (limit < 1 || limit > 100) {
      return reply.badRequest('Limit must be between 1 and 100');
    }

    try {
      const offset = (page - 1) * limit;

      // Get total count for pagination metadata
      const totalCount = fastify.sqlite.prepare(`
        SELECT COUNT(*) as total FROM media
      `).get() as { total: number };

      const rows = fastify.sqlite.prepare(`
        SELECT media.*, users.username,
          CASE WHEN likes.user_id IS NOT NULL THEN 1 ELSE 0 END AS likedByUser,
          CASE WHEN media.created_by = ? THEN 1 ELSE 0 END AS deletable
        FROM media
        LEFT JOIN likes ON media.id = likes.media_id AND likes.user_id = ?
        LEFT JOIN users ON media.created_by = users.username
        ORDER BY media.created_at ASC, media.id ASC
        LIMIT ? OFFSET ?
      `).all(username, userId, limit, offset);

      const totalPages = Math.ceil(totalCount.total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      if (rows.length === 0 && page === 1) {
        return reply.status(204).send();
      } else {
        return reply.send({
          data: rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount.total,
            itemsPerPage: limit,
            hasNextPage,
            hasPreviousPage
          }
        });
      }
    } catch (err) {
      return reply.internalServerError('Error fetching media files');
    }
  });
}

export default getAllMedia;
