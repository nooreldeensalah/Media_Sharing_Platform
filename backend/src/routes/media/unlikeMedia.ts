import { FastifyPluginAsync } from 'fastify'

const unLikeMediaSchema = {
  "tags": ["media"],
  "summary": "Unlike a media file",
  "params": {
    "type": "object",
    "properties": {
      "fileName": {
        "type": "string",
        "description": "The name of the file to unlike"
      }
    },
    "required": ["fileName"]
  },
  "response": {
    "200": {
      "description": "File unLiked successfully",
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
      "description": "Error unLiking file",
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}

const unlikeMedia: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/:fileName/unlike', { schema: unLikeMediaSchema }, async (req, reply) => {
    const { fileName } = req.params as { fileName: string };

    try {
      // Check if the file exists
      const { rowCount } = await fastify.pg.query('SELECT 1 FROM media WHERE file_name = $1', [fileName]);
      if (rowCount === 0) {
        return reply.notFound(`File ${fileName} not found`);
      }

      // Decrement the likes count in the database and return the new likes count
      const { rows } = await fastify.pg.query('UPDATE media SET likes = likes - 1 WHERE file_name = $1 RETURNING likes', [fileName]);
      const newLikesCount = rows[0].likes;

      return reply.send({ message: `File ${fileName} unLiked successfully!`, newLikesCount });
    } catch (err) {
      return reply.internalServerError('Error unLiking file');
    }
  });
}

export default unlikeMedia;
