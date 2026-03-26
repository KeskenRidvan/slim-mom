export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Slim Mom API",
    version: "1.0.0",
    description: "Slim Mom daily rate, product search and diary endpoints.",
  },
  servers: [{ url: "http://localhost:4000/api" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Jane" },
                  email: { type: "string", example: "jane@example.com" },
                  password: { type: "string", example: "password123" },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "Registered successfully" },
          409: { description: "Email already exists" },
        },
      },
    },
    "/auth/signin": {
      post: {
        summary: "Sign in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "jane@example.com" },
                  password: { type: "string", example: "password123" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Signed in successfully" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/refresh": {
      post: {
        summary: "Refresh access and refresh token pair",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  refreshToken: { type: "string" },
                },
                required: ["refreshToken"],
              },
            },
          },
        },
        responses: {
          200: { description: "Tokens refreshed" },
          401: { description: "Invalid or expired session" },
        },
      },
    },
    "/auth/logout": {
      post: {
        summary: "Logout current session",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logged out" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/public/daily-rate": {
      post: {
        summary: "Calculate daily calorie rate (public)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  height: { type: "number", example: 170 },
                  age: { type: "number", example: 25 },
                  currentWeight: { type: "number", example: 70 },
                  desiredWeight: { type: "number", example: 60 },
                  bloodType: { type: "number", enum: [1, 2, 3, 4], example: 2 },
                },
                required: [
                  "height",
                  "age",
                  "currentWeight",
                  "desiredWeight",
                  "bloodType",
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Daily rate and not recommended foods",
          },
        },
      },
    },
    "/private/daily-rate": {
      post: {
        summary: "Calculate or fetch daily rate for authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  height: { type: "number" },
                  age: { type: "number" },
                  currentWeight: { type: "number" },
                  desiredWeight: { type: "number" },
                  bloodType: { type: "number", enum: [1, 2, 3, 4] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Daily rate and not recommended foods",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/products": {
      get: {
        summary: "Search products by query string",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
            description: "Partial product name",
            required: false,
          },
        ],
        responses: {
          200: {
            description: "Matched product list",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/meals": {
      post: {
        summary: "Add a consumed product for a user on a given date",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  date: { type: "string", description: "DD.MM.YYYY" },
                  productId: { type: "string" },
                  grams: { type: "number" },
                },
                required: ["userId", "date", "productId", "grams"],
              },
            },
          },
        },
      },
      get: {
        summary: "Get meals for user and date",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "userId", required: true, schema: { type: "string" } },
          { in: "query", name: "date", required: true, schema: { type: "string" } },
        ],
      },
    },
    "/meals/{mealId}": {
      delete: {
        summary: "Delete meal by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "mealId",
            required: true,
            schema: { type: "string" },
          },
          { in: "query", name: "userId", required: true, schema: { type: "string" } },
          { in: "query", name: "date", required: true, schema: { type: "string" } },
        ],
      },
    },
  },
};
