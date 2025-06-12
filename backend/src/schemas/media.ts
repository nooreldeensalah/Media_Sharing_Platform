// Media-related schemas
export const getAllMediaSchema = {
  tags: ["media"],
  summary: "Get all media files with pagination",
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
      user: { type: "string", description: "Filter by username" },
      search: { type: "string", description: "Search in original file names" }
    }
  },
  response: {
    200: {
      description: "Paginated list of media files",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              file_name: { type: "string" },
              original_filename: { type: "string" },
              likes: { type: "integer" },
              url: { type: "string" },
              created_at: { type: "string", format: "date-time" },
              mimetype: { type: "string" },
              likedByUser: { type: "boolean" },
              created_by: { type: "string" },
              deletable: { type: "boolean" }
            }
          }
        },
        pagination: {
          type: "object",
          properties: {
            currentPage: { type: "integer" },
            totalPages: { type: "integer" },
            totalItems: { type: "integer" },
            itemsPerPage: { type: "integer" },
            hasNextPage: { type: "boolean" },
            hasPreviousPage: { type: "boolean" }
          }
        }
      }
    },
    400: {
      description: "Invalid pagination parameters",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    204: {
      description: "No media files found",
      type: "null"
    },
    500: {
      description: "Error fetching media files",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const getMediaSchema = {
  tags: ["media"],
  summary: "Get a specific media file",
  params: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "The ID of the file to retrieve"
      }
    },
    required: ["id"]
  },
  response: {
    200: {
      description: "Media file details",
      type: "object",
      properties: {
        id: { type: "integer" },
        file_name: { type: "string" },
        original_filename: { type: "string" },
        likes: { type: "integer" },
        url: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        mimetype: { type: "string" },
        likedByUser: { type: "boolean" },
        created_by: { type: "string" },
        deletable: { type: "boolean" }
      }
    },
    404: {
      description: "File not found",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    500: {
      description: "Error retrieving file",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const toggleLikeSchema = {
  tags: ["media"],
  summary: "Toggle like/unlike for a media file",
  params: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "The ID of the file to toggle like"
      }
    },
    required: ["id"]
  },
  body: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["like", "unlike"],
        description: "Action to perform: like or unlike"
      }
    },
    required: ["action"]
  },
  response: {
    200: {
      description: "Like status toggled successfully",
      type: "object",
      properties: {
        message: { type: "string" },
        action: { type: "string" },
        newLikeCount: { type: "integer" }
      }
    },
    400: {
      description: "Bad request",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    404: {
      description: "File not found",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const deleteMediaSchema = {
  tags: ["media"],
  summary: "Delete a media file",
  params: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "The ID of the file to delete"
      }
    },
    required: ["id"]
  },
  response: {
    200: {
      description: "File deleted successfully",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    403: {
      description: "Forbidden - insufficient permissions",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    404: {
      description: "File not found",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    500: {
      description: "Error deleting file",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const getPreSignedPutURLSchema = {
  tags: ["media"],
  body: {
    type: 'object',
    required: ['fileName', 'mimeType'],
    properties: {
      fileName: { type: 'string' },
      mimeType: { type: 'string' },
      originalFilename: { type: 'string' }
    }
  },
  summary: 'Get a pre-signed URL for uploading a file to S3',
  response: {
    200: {
      type: 'object',
      properties: {
        url: { type: 'string' }
      }
    },
    400: {
      description: "Invalid file type",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    500: {
      description: "Error generating pre-signed URL",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const notifyUploadSchema = {
  tags: ["media"],
  body: {
    type: "object",
    required: ["fileName", "mimeType"],
    properties: {
      fileName: { type: "string" },
      mimeType: { type: "string" },
      originalFilename: { type: "string" },
    },
  },
  summary: "Notify backend server of media uploads to S3",
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "number" },
        file_name: { type: "string" },
        likes: { type: "number" },
        url: { type: "string" },
        original_filename: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        mimetype: { type: "string" },
        created_by: { type: "string" },
        deletable: { type: "boolean" },
      },
    },
    400: {
      description: "Bad request",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    404: {
      description: "File not found in S3",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    },
    500: {
      description: "Error notifying upload",
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  },
};
