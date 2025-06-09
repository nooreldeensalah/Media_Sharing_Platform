import { FastifyPluginAsync } from 'fastify';
import { generateCanonicalUrl } from '../../utils/urlGenerator';

const getMediaSchema = {
  "tags": ["media"],
  "summary": "Get a pre-signed URL for a media file",
  "params": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "description": "The ID of the file to retrieve"
      }
    },
    "required": ["id"]
  },
  "response": {
    "200": {
      "description": "Presigned URL for the media file",
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
      "description": "Error retrieving file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const getMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:id', { schema: getMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      const row = fastify.sqlite.prepare('SELECT * FROM media WHERE id = ?').get(id) as any;

      if (!row) {
        return reply.notFound('File not found in database');
      }

      const mediaWithUrl = {
        ...row,
        url: generateCanonicalUrl(row.file_name)
      };

      return reply.send(mediaWithUrl);
    } catch (err) {
      return reply.internalServerError('Error retrieving file');
    }
  });
}

export default getMedia;
