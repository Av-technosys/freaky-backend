// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
const dotenv = require("dotenv");
dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.js",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: ["public.*", "!spatial_ref_sys", "!geography_columns", "!geometry_columns"],
});
