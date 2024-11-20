import { FastifyPluginAsync } from 'fastify'

// TODO: Move this into a separate file
const uploadMediaSchema = {
  "tags": ["media"],
  "summary": "Upload a media file",
  "body": {
    "type": "object",
    "properties": {
      "file": {
        "type": "string",
        "format": "binary",
        "description": "The file to upload"
      }
    },
    "required": ["file"]
  },
  "response": {
    "200": {
      "description": "File uploaded successfully",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "400": {
      "description": "Invalid file type or no file uploaded",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "500": {
      "description": "Error uploading file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const uploadMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  const uploadToMinIO = async (bucketName: string, objectName: string, buffer: Buffer) => {
      await fastify.minio.putObject(bucketName, objectName, buffer);
  };

  const ensureBucketExists = async (bucketName: string) => {
      const exists = await fastify.minio.bucketExists(bucketName);
      if (!exists) {
          await fastify.minio.makeBucket(bucketName);
      }
  };

  fastify.post('/upload', {schema: uploadMediaSchema}, async (request, reply) => {
      const data = await request.file();

      if (!data) {
          return reply.badRequest('No file uploaded!');
      }

      const fileBuffer = await data.toBuffer();
      const fileName = data.filename;

      await ensureBucketExists(BUCKET_NAME);
      await uploadToMinIO(BUCKET_NAME, fileName, fileBuffer);

      return reply.send({ message: 'File uploaded successfully!' });
  });
}

export default uploadMedia;
