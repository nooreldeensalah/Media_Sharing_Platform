import { FastifyPluginAsync } from "fastify";

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
      },
    },
  },
};

const notifyUpload: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.post(
    "/notify-upload",
    { schema: notifyUploadSchema },
    async (req, reply) => {
      const { fileName, mimeType } = req.body as {
        fileName: string;
        mimeType: string;
      };

      const url = await fastify.minio.presignedGetObject(BUCKET_NAME, fileName);

      // Save metadata to the database
      const { rows } = await fastify.pg.query(
        "INSERT INTO media (file_name, likes, url, created_at, mimetype) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [fileName, 0, url, new Date(), mimeType]
      );

      return reply.send(rows[0]);
    }
  );
};

export default notifyUpload;
