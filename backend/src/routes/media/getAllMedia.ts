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
  fastify.get('/', { schema: getAllMediaSchema }, async (request, reply) => {
    try {
      const rows = fastify.sqlite.prepare('SELECT * FROM media ORDER BY id ASC').all();
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
