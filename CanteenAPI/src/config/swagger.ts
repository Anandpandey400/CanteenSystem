import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Canteen API",
      version: "1.0.0",
      description: "API documentation for Canteen Management System",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },

  // 👇 Path to your route files
  apis: ["src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
