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
    "404": {
      "description": "No media files found",
      "type": "object",
      "properties": {
        "statusCode": {
          "type": "integer"
        },
        "error": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      }
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
      const { rows } = await fastify.pg.query('SELECT * FROM media');
      if (rows.length === 0) {
        return reply.notFound('No media files found');
      } else {
        return reply.send(rows);
      }
    } catch (err) {
      return reply.internalServerError('Error fetching media files');
    }
  });
}

export default getAllMedia;
