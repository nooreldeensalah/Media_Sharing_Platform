import { FastifyPluginAsync } from 'fastify';

const unLikeMediaSchema = {
  "tags": ["media"],
  "summary": "Unlike a media file",
  "params": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "description": "The ID of the file to unlike"
      }
    },
    "required": ["id"]
  },
  "response": {
    "200": {
      "description": "File unLiked successfully",
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
      "description": "Error unLiking file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const unlikeMedia: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/:id/unlike', { schema: unLikeMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      const stmt = fastify.sqlite.prepare('UPDATE media SET likes = likes - 1 WHERE id = ?');
      const info = stmt.run(id);

      if (info.changes === 0) {
        return reply.notFound('File not found');
      }

      return reply.send({ message: `File with ID: ${id} unLiked successfully!` });
    } catch (err) {
      return reply.internalServerError('Error unLiking file');
    }
  });
}

export default unlikeMedia;
