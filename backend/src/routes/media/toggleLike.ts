import { FastifyPluginAsync } from 'fastify';

const toggleLikeSchema = {
  "tags": ["media"],
  "summary": "Toggle like/unlike for a media file",
  "params": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "description": "The ID of the file to toggle like"
      }
    },
    "required": ["id"]
  },
  "body": {
    "type": "object",
    "properties": {
      "action": {
        "type": "string",
        "enum": ["like", "unlike"],
        "description": "Action to perform: like or unlike"
      }
    },
    "required": ["action"]
  },
  "response": {
    "200": {
      "description": "Like status toggled successfully",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        },
        "action": {
          "type": "string"
        },
        "newLikeCount": {
          "type": "integer"
        }
      }
    },
    "400": {
      "description": "Bad request",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "404": {
      "description": "File not found",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "500": {
      "description": "Internal server error",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const toggleLike: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/:id/toggle-like', { schema: toggleLikeSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const { action } = request.body as { action: 'like' | 'unlike' };
    const userId = request.user.id;

    try {
      // Check if the media exists
      const mediaExists = fastify.sqlite.prepare('SELECT id, likes FROM media WHERE id = ?').get(id);
      if (!mediaExists) {
        return reply.notFound('File not found in database');
      }

      // Check current like status
      const likeExists = fastify.sqlite.prepare('SELECT 1 FROM likes WHERE user_id = ? AND media_id = ?').get(userId, id);

      if (action === 'like') {
        if (likeExists) {
          return reply.badRequest('You have already liked this media');
        }

        // Add like
        const updateStmt = fastify.sqlite.prepare('UPDATE media SET likes = likes + 1 WHERE id = ?');
        updateStmt.run(id);
        fastify.sqlite.prepare('INSERT INTO likes (user_id, media_id) VALUES (?, ?)').run(userId, id);

        // Get updated like count
        const updatedMedia = fastify.sqlite.prepare('SELECT likes FROM media WHERE id = ?').get(id) as { likes: number };

        return reply.send({
          message: `File with ID: ${id} liked successfully!`,
          action: 'liked',
          newLikeCount: updatedMedia.likes
        });

      } else if (action === 'unlike') {
        if (!likeExists) {
          return reply.badRequest('You have not liked this media');
        }

        // Remove like
        const updateStmt = fastify.sqlite.prepare('UPDATE media SET likes = likes - 1 WHERE id = ?');
        updateStmt.run(id);
        fastify.sqlite.prepare('DELETE FROM likes WHERE user_id = ? AND media_id = ?').run(userId, id);

        // Get updated like count
        const updatedMedia = fastify.sqlite.prepare('SELECT likes FROM media WHERE id = ?').get(id) as { likes: number };

        return reply.send({
          message: `File with ID: ${id} unliked successfully!`,
          action: 'unliked',
          newLikeCount: updatedMedia.likes
        });
      }

    } catch (err) {
      return reply.internalServerError('Error toggling like status');
    }
  });
};

export default toggleLike;
