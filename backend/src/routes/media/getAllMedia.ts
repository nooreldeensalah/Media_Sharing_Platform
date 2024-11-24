import { FastifyPluginAsync } from 'fastify'

// Move this into a separate file if needed
const getAllMediaSchema = {
  "tags": ["media"],
  "summary": "Get all media files",
  "response": {
    "200": {
      "description": "List of media files",
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
          'created_by': {
            'type': 'string'
          }
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

    try {
      const rows = fastify.sqlite.prepare(`
        SELECT media.*, users.username,
          CASE WHEN likes.user_id IS NOT NULL THEN 1 ELSE 0 END AS likedByUser
        FROM media
        LEFT JOIN likes ON media.id = likes.media_id AND likes.user_id = ?
        LEFT JOIN users ON media.created_by = users.username
        ORDER BY media.id ASC
      `).all(userId);

      if (rows.length === 0) {
        return reply.status(204).send();
      } else {
        return reply.send(rows);
      }
    } catch (err) {
      return reply.internalServerError('Error fetching media files');
    }
  });
}

export default getAllMedia;
