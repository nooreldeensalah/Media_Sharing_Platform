import { FastifyPluginAsync } from "fastify";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
        created_by: {type: "string"}
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
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName
      });

      const url = await getSignedUrl(fastify.s3, command, { expiresIn: 60 * 60 * 24 * 7 });
      const stmt = fastify.sqlite.prepare('INSERT INTO media (file_name, likes, url, created_at, mimetype, created_by) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(fileName, 0, url, new Date().toISOString(), mimeType, mediaCreator);

      return reply.send({ id: info.lastInsertRowid, file_name: fileName, likes: 0, url, created_at: new Date(), mimetype: mimeType, created_by: mediaCreator });
    } catch (err) {
      return reply.internalServerError('Error notifying upload');
    }
  })
};

export default notifyUpload;
