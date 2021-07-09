export const getYears = {
  summary: "Returns all years",
  responses: {
    "200": {
      description: "A list of years.",
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
                    year: { type: "string" },
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
