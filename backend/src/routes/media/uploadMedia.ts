import { FastifyPluginAsync } from 'fastify'

// TODO: Move this into a separate file
// TODO: There's an issue when handling multipart data and using JSON schemas
// const uploadMediaSchema = {
//   "tags": ["media"],
//   "summary": "Upload a media file",
//   "body": {
//     "type": "object",
//     "properties": {
//       "file": {
//         "type": "string",
//         "format": "binary",
//         "description": "The file to upload"
//       }
//     },
//     "required": ["file"]
//   },
//   "response": {
//     "200": {
//       "description": "File uploaded successfully",
//       "type": "object",
//       "properties": {
//         "message": {
//           "type": "string"
//         }
//       }
//     },
//     "400": {
//       "description": "Invalid file type or no file uploaded",
//       "type": "object",
//       "properties": {
//         "message": {
//           "type": "string"
//         }
//       }
//     },
//     "500": {
//       "description": "Error uploading file",
//       "type": "object",
//       "properties": {
//         "message": {
//           "type": "string"
//         }
//       }
//     }
//   }
// }

const uploadMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg', 'video/quicktime'];

  const uploadToMinIO = async (bucketName: string, objectName: string, buffer: Buffer) => {
    await fastify.minio.putObject(bucketName, objectName, buffer);
  };

  const ensureBucketExists = async (bucketName: string) => {
    const exists = await fastify.minio.bucketExists(bucketName);
    if (!exists) {
      await fastify.minio.makeBucket(bucketName);
    }
  };

  fastify.post('/upload', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.badRequest('No file uploaded!');
    }

    const fileBuffer = await data.toBuffer();
    const fileName = data.filename;
    const mimeType = data.mimetype;

    if (!allowedMimeTypes.includes(mimeType)) {
      return reply.badRequest('Invalid file type!');
    }

    await ensureBucketExists(BUCKET_NAME);
    await uploadToMinIO(BUCKET_NAME, fileName, fileBuffer);

    const url = await fastify.minio.presignedGetObject(BUCKET_NAME, fileName);
    const stmt = fastify.sqlite.prepare(
      'INSERT INTO media (file_name, likes, url, created_at, mimetype) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(fileName, 0, url, new Date().toISOString(), mimeType);

    return reply.send({ id: info.lastInsertRowid, file_name: fileName, likes: 0, url, created_at: new Date(), mimetype: mimeType });
  });
}

export default uploadMedia;
