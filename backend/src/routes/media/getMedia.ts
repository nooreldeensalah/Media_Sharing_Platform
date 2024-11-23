import { FastifyPluginAsync } from 'fastify'
import { S3Error } from 'minio';

// TODO: Move this into a separate file
const getMediaSchema = {
  "tags": ["media"],
  "summary": "Get a presigned URL for a media file",
  "params": {
    "type": "object",
    "properties": {
      "fileName": {
        "type": "string",
        "description": "The name of the file to retrieve"
      }
    },
    "required": ["fileName"]
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
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };
  fastify.get('/:fileName', { schema: getMediaSchema }, async (request, reply) => {
    const { fileName } = request.params as { fileName: string };

    try {
      // Check if file exists in MinIO before querying the database
      await fastify.minio.statObject(BUCKET_NAME, fileName);
      const row = fastify.sqlite.prepare('SELECT * FROM media WHERE file_name = ?').get(fileName);

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
