import { FastifyPluginAsync } from 'fastify'

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
        "url": {
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

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.get('/:fileName', {  schema: getMediaSchema }, async (request, reply) => {
    const { fileName } = request.params as { fileName: string };

    try {
        const url = await fastify.minio.presignedGetObject(BUCKET_NAME, fileName);
        reply.send({ url });
    } catch (err) {
        reply.notFound('File not found');
    }
});
}

export default root;
