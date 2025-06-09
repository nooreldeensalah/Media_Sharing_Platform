import { FastifyPluginAsync } from "fastify";
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { generateCanonicalUrl } from '../../utils/urlGenerator';

const notifyUploadSchema = {
  tags: ["media"],
  body: {
    type: "object",
    required: ["fileName", "mimeType"],
    properties: {
      fileName: { type: "string" },
      mimeType: { type: "string" },
    },
  },
  summary: "Notify backend server of media uploads to S3",
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "number" },
        file_name: { type: "string" },
        likes: { type: "number" },
        url: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        mimetype: { type: "string" },
        created_by: {type: "string"},
        deletable: { type: "boolean" },
      },
    },
  },
};

const notifyUpload: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.post('/notify-upload', { schema: notifyUploadSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { fileName, mimeType } = request.body as { fileName: string; mimeType: string };
    const mediaCreator = request.user.username;

    try {
      // Verify the file exists in S3 before storing in database
      await fastify.s3.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName
      }));

      // Store media metadata in database (without URL - we'll generate canonical URLs dynamically)
      const stmt = fastify.sqlite.prepare('INSERT INTO media (file_name, likes, created_at, mimetype, created_by) VALUES (?, ?, ?, ?, ?)');
      const info = stmt.run(fileName, 0, new Date().toISOString(), mimeType, mediaCreator);

      // Generate canonical URL for response
      const canonicalUrl = generateCanonicalUrl(fileName);

      return reply.send({
        id: info.lastInsertRowid,
        file_name: fileName,
        likes: 0,
        url: canonicalUrl,
        created_at: new Date().toISOString(),
        mimetype: mimeType,
        created_by: mediaCreator,
        deletable: true
      });
    } catch (err: any) {
      if (err.name === 'NoSuchKey' || err.name === 'NotFound') {
        return reply.notFound('File not found in S3');
      }
      console.error('Error notifying upload:', err);
      return reply.internalServerError('Error notifying upload');
    }
  })
};

export default notifyUpload;
