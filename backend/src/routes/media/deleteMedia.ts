import { FastifyPluginAsync } from 'fastify';
import { HeadObjectCommand, DeleteObjectCommand, S3ServiceException } from '@aws-sdk/client-s3';

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
  likes: number;
  url: string;
  created_at: string;
  mimetype: string;
  created_by: string;
}


const deleteMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.delete('/:id', { schema: deleteMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const { username } = request.user

    try {
      const row = fastify.sqlite.prepare('SELECT * FROM media WHERE id = ?').get(id) as MediaItem;

      if (row.created_by !== username) {
        return reply.forbidden('You do not have permission to delete this file');
      }

      if (!row) {
        return reply.notFound('File not found in database');
      }

      await fastify.s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: row.file_name }));
      await fastify.s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: row.file_name }));
      const stmt = fastify.sqlite.prepare('DELETE FROM media WHERE id = ?');
      const info = stmt.run(id);

      if (info.changes === 0) {
        return reply.notFound('File not found in database');
      }

      return reply.send({ message: 'File deleted successfully' });
    } catch (err) {
      if ((err as S3ServiceException).$metadata?.httpStatusCode === 404) {
        console.error(err);
        return reply.notFound('File not found in S3 bucket');
      }
      return reply.internalServerError('Error deleting file');
    }
  });

}

export default deleteMedia;
