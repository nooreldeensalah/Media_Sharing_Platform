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
        },
        "newLikesCount": {
          "type": "number"
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
  fastify.post('/:fileName/like', { schema: likeMediaSchema }, async (req, reply) => {
    const { fileName } = req.params as { fileName: string };

    try {
      // Check if the file exists
      const { rowCount } = await fastify.pg.query('SELECT 1 FROM media WHERE file_name = $1', [fileName]);
      if (rowCount === 0) {
        return reply.notFound(`File ${fileName} not found`);
      }

      // Increment the likes count in the database and return the new likes count
      const { rows } = await fastify.pg.query('UPDATE media SET likes = likes + 1 WHERE file_name = $1 RETURNING likes', [fileName]);
      const newLikesCount = rows[0].likes;

      return reply.send({ message: `File ${fileName} unLiked successfully!`, newLikesCount });
    } catch (err) {
      return reply.internalServerError('Error liking file');
    }
  });
}

export default likeMedia;
