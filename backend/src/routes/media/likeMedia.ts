import { FastifyPluginAsync } from 'fastify'

const likeMediaSchema = {
  "tags": ["media"],
  "summary": "Like a media file",
  "params": {
    "type": "object",
    "properties": {
      "fileName": {
        "type": "string",
        "description": "The name of the file to like"
      }
    },
    "required": ["fileName"]
  },
  "response": {
    "200": {
      "description": "File liked successfully",
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
      "description": "Error liking file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const likeMedia: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/:fileName/like', { schema: likeMediaSchema }, async (request, reply) => {
    const { fileName } = request.params as { fileName: string };

    try {
      const stmt = fastify.sqlite.prepare('UPDATE media SET likes = likes + 1 WHERE file_name = ?');
      const info = stmt.run(fileName);

      if (info.changes === 0) {
        return reply.notFound('File not found in database');
      }

      return reply.send({message: `File ${fileName} liked successfully!`});
    } catch (err) {
      return reply.internalServerError('Error liking file');
    }
  });
};

export default likeMedia;
