export const getArtists = {
  summary: "Returns all artists",
  responses: {
    "200": {
      description: "A list of artists.",
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
                    artistId: { type: "number" },
                    name: { type: "string" },
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
