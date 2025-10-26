import { config } from "dotenv";
import { defineConfig } from "orval";

config();

export default defineConfig({
  taskerra: {
    input: "http://localhost:3333/reference/openapi.json",
    output: {
      mode: "tags-split",
      target: "./src/http/gen/endpoints",
      schemas: "./src/http/gen/models",
      fileExtension: ".gen.ts",

      baseUrl: process.env.NEXT_PUBLIC_API_URL,

      client: "react-query",
      namingConvention: "kebab-case",
      biome: true,

      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },

        mutator: {
          path: "./src/lib/orval/http-client.ts",
          name: "httpClient",
        },
      },
    },
  },
});
