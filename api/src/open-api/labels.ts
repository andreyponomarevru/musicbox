export const getLabels = {
  summary: "Returns all labels",
  responses: {
    "200": {
      description: "A list of labels.",
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
                    labelId: { type: "number" },
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
