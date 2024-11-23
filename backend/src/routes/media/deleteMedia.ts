import { FastifyPluginAsync } from 'fastify';
import { S3Error } from 'minio';

const deleteMediaSchema = {
  "tags": ["media"],
  "summary": "Delete a media file",
  "params": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "description": "The ID of the file to delete"
      }
    },
    "required": ["id"]
  },
  "response": {
    "200": {
      "description": "File deleted successfully",
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
      "description": "Error deleting file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
};

interface MediaItem {
  id: number;
  file_name: string;
  url: string;
  mimetype: string;
  likes: number;
  created_at: string;
}

const deleteMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.delete('/:id', { schema: deleteMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      const row = fastify.sqlite.prepare('SELECT file_name FROM media WHERE id = ?').get(id) as MediaItem;

      if (!row) {
        return reply.notFound('File not found in database');
      }

      await fastify.minio.statObject(BUCKET_NAME, row.file_name);
      await fastify.minio.removeObject(BUCKET_NAME, row.file_name);
      const stmt = fastify.sqlite.prepare('DELETE FROM media WHERE id = ?');
      const info = stmt.run(id);

      if (info.changes === 0) {
        return reply.notFound('File not found in database');
      }

      return reply.send({ message: 'File deleted successfully' });
    } catch (err) {
      if ((err as S3Error).code === 'NotFound') {
        return reply.notFound('File not found in MinIO bucket');
      }
      return reply.internalServerError('Error deleting file');
    }
  });

}

export default deleteMedia;
