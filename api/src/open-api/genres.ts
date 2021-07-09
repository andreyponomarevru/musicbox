export const getGenres = {
  summary: "Returns all genres",
  responses: {
    "200": {
      description: "A list of genres.",
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
                    genreId: { type: "number" },
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
