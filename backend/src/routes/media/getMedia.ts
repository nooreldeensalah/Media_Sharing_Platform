import { FastifyPluginAsync } from 'fastify';
import { S3Error } from 'minio';

const getMediaSchema = {
  "tags": ["media"],
  "summary": "Get a presigned URL for a media file",
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
  fastify.get('/:id', { schema: getMediaSchema }, async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      const row = fastify.sqlite.prepare('SELECT * FROM media WHERE id = ?').get(id);

      if (!row) {
        return reply.notFound('File not found in database');
      }

      return reply.send(row);
    } catch (err) {
      if ((err as S3Error).code === 'NotFound') {
        return reply.notFound('File not found in MinIO bucket');
      }
      return reply.internalServerError('Error retrieving file');
    }
  });
}

export default getMedia;
