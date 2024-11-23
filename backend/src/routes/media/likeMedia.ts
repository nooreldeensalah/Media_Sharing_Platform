import { FastifyPluginAsync } from 'fastify';

const likeMediaSchema = {
  "tags": ["media"],
  "summary": "Like a media file",
  "params": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "description": "The ID of the file to like"
      }
    },
    "required": ["id"]
  },
  "response": {
    "200": {
      "description": "File liked successfully",
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
      "description": "Error liking file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const likeMedia: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/:id/like', { schema: likeMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      const stmt = fastify.sqlite.prepare('UPDATE media SET likes = likes + 1 WHERE id = ?');
      const info = stmt.run(id);

      if (info.changes === 0) {
        return reply.notFound('File not found in database');
      }

      return reply.send({ message: `File with ID: ${id} liked successfully!` });
    } catch (err) {
      return reply.internalServerError('Error liking file');
    }
  });
};

export default likeMedia;
