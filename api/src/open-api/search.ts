export const findTracks = {
  summary: "Returns search results (paginated)",
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
  },
};
