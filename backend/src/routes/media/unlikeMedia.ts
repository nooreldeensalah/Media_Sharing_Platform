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
      const { rows } = await fastify.pg.query(
        'UPDATE media SET likes = likes - 1 WHERE file_name = $1 RETURNING file_name, likes',
        [fileName]
      );

      if (rows.length === 0) {
        return reply.notFound('File not found');
      }

      const newLikesCount = rows[0].likes;
      return reply.send({ message: `File ${fileName} unLiked successfully!`, newLikesCount });
    } catch (err) {
      return reply.internalServerError('Error unLiking file');
    }
  });
}

export default unlikeMedia;
