import { FastifyPluginAsync } from 'fastify'

// TODO: Add this to a separate file
const deleteMediaSchema = {
  "tags": ["media"],
  "summary": "Delete a media file",
  "params": {
    "type": "object",
    "properties": {
      "fileName": {
        "type": "string",
        "description": "The name of the file to delete"
      }
    },
    "required": ["fileName"]
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
}

const deleteMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.delete('/:fileName', { schema: deleteMediaSchema }, async (req, reply) => {
    const { fileName } = req.params as { fileName: string };

    try {
        await fastify.minio.removeObject(BUCKET_NAME, fileName);
        reply.send({ message: `File ${fileName} deleted successfully!` });
    } catch (err) {
        reply.internalServerError('Error deleting file');
    }
});
}

export default deleteMedia;
