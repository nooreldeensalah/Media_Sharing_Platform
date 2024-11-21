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
        "id": {
          "type": "integer"
        },
        "file_name": {
          "type": "string"
        },
        "likes": {
          "type": "integer"
        },
        "url": {
          "type": "string"
        },
        "created_at": {
          "type": "string",
          "format": "date-time"
        },
        "mimetype": {
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
  fastify.get('/:fileName', { schema: getMediaSchema }, async (request, reply) => {
    const { fileName } = request.params as { fileName: string };

    try {
        const { rows } = await fastify.pg.query('SELECT * FROM media WHERE file_name = $1', [fileName]);
        if (rows.length === 0) {
            return reply.notFound('File not found in database');
        }
        return reply.send(rows[0]);
    } catch (err) {
            return reply.internalServerError('Error retrieving file');
    }
  });
}

export default root;
