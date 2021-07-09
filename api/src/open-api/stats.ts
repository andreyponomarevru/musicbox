export const getStats = {
  summary: "Returns library statistics",
  responses: {
    "200": {
      description: "Short statistics for the main entities in database.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "object",
                properties: {
                  artists: { type: "number" },
                  genres: { type: "number" },
                  labels: { type: "number" },
                  releases: { type: "number" },
                  tracks: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getGenresStats = {
  summary: "Returns genres statistics",
  responses: {
    "200": {
      description: "Statistics for every genre",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    tracks: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getArtistsStats = {
  summary: "Returns artists statistics",
  responses: {
    "200": {
      description: "Statistics for every artist",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    tracks: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getLabelsStats = {
  summary: "Returns labels statistics",
  responses: {
    "200": {
      description: "Statistics for every label",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    tracks: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getYearsStats = {
  summary: "Returns years statistics",
  responses: {
    "200": {
      description: "Statistics for every year",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    tracks: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
