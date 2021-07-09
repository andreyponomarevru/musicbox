export const getTracks = {
  summary: "Returns all tracks (paginated)",
  responses: {
    "200": {
      description: "A list of tracks.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              firstPage: {
                type: "string",
                nullable: true,
                description: "Link to the first page of response",
              },
              lastPage: {
                type: "string",
                nullable: true,
                description: "Link to the last page of response",
              },
              nextPage: {
                type: "string",
                nullable: true,
                description: "Link to the next page of response",
              },
              pageNumber: {
                type: "number",
                nullable: true,
                description: "Current page number",
              },
              previousPage: {
                type: "string",
                nullable: true,
              },
              totalCount: {
                type: "number",
              },
              totalPages: {
                type: "number",
              },
              results: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/track",
                },
              },
            },
          },
        },
      },
    },
    "404": {
      description: "Not Found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};

export const deleteTrack = {
  summary: "Delete track",
  parameters: [
    {
      name: "trackId",
      in: "path",
      description: "track id",
      required: true,
      schema: { type: "number" },
    },
  ],
  responses: {
    "204": {
      description: "Track successfully deleted.",
    },
    "404": {
      description: "Not Found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
    "400": {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};

export const createTrack = {
  summary: "Create track.",
  description:
    "Before creating a track, you have to create a release, otherwise API will return '400 Bad Request' error.",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            releaseId: { type: "number" },
            trackNo: { type: "number" },
            diskNo: { type: "number" },
            artist: { type: "array", items: { type: "string" } },
            title: { type: "string" },
            genre: { type: "array", items: { type: "string" } },
            duration: { type: "number" },
            filePath: { nullable: true },
            extension: { type: "string" },
            bitrate: { type: "number" },
          },
        },
      },
    },
  },
  responses: {
    "201": {
      description: "Track successfully created.",
      headers: {
        location: { schema: { type: "string" } },
      },
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/track",
          },
        },
      },
    },
    "400": {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};

export const updateTrack = {
  summary: "Update track.",
  parameters: [
    {
      name: "trackId",
      in: "path",
      description: "track id",
      required: true,
      schema: { type: "number" },
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            filePath: { nullable: true },
            extension: { type: "string" },
            artist: { type: "array", items: { type: "string" } },
            duration: { type: "number" },
            bitrate: { type: "number" },
            trackNo: { type: "number" },
            title: { type: "string" },
            diskNo: { type: "number" },
            genre: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Track updated successfully.",
      headers: {
        location: { schema: { type: "string" } },
      },
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "object",
                $ref: "#/components/schemas/track",
              },
            },
          },
        },
      },
    },
  },
};

export const streamTrack = {
  summary: "Returns track's audio stream",
  parameters: [
    {
      name: "trackId",
      in: "path",
      description: "track id",
      required: true,
      schema: { type: "number" },
    },
  ],
  responses: {
    "200": {
      description: "A list of tracks.",
      headers: {
        "cache-control": { schema: { type: "string" } },
        "content-type": { schema: { type: "string" } },
        "accept-ranges": { schema: { type: "string" } },
        "content-range": { schema: { type: "string" } },
        "content-length": { schema: { type: "string" } },
      },
      content: {
        "audio/mpeg": {
          schema: { type: "string", format: "binary" },
        },
      },
    },
    "404": {
      description: "Not Found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};
