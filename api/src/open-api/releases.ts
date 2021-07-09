export const getReleases = {
  summary: "Returns all releases (paginated)",
  responses: {
    "200": {
      description: "A list of releases.",
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
                  $ref: "#/components/schemas/release",
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

export const getRelease = {
  summary: "Returns release by id",
  responses: {
    "200": {
      description: "Release.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "object",
                $ref: "#/components/schemas/release",
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

export const getReleaseTracks = {
  summary: "Returns release tracks by release id",
  responses: {
    "200": {
      description: "Release tracks.",
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

export const deleteRelease = {
  summary: "Delete release",
  parameters: [
    {
      name: "releaseId",
      in: "path",
      description: "release id",
      required: true,
      schema: { type: "number" },
    },
  ],
  responses: {
    "204": {
      description: "Release successfully deleted.",
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

export const createRelease = {
  summary: "Create release.",
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            year: { type: "number" },
            label: { type: "string" },
            catNo: { type: "string" },
            artist: { type: "string" },
            title: { type: "string" },
            releaseCover: { type: "string", format: "binary" },
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

export const updateRelease = {
  summary: "Update release.",
  parameters: [
    {
      name: "releaseId",
      in: "path",
      description: "release id",
      required: true,
      schema: { type: "number" },
    },
  ],
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            year: { type: "number" },
            label: { type: "string" },
            catNo: { type: "string" },
            artist: { type: "string" },
            title: { type: "string" },
            releaseCover: { type: "string", format: "binary" },
          },
        },
      },
    },
  },
  responses: {
    "204": {
      description: "Release updated successfully.",
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
                $ref: "#/components/schemas/release",
              },
            },
          },
        },
      },
    },
    "409": {
      description:
        "Conflict. Release with the provided catalog number ('catNo') already exists in database",
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
