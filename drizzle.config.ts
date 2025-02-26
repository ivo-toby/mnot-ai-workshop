import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo_db',
  },
} satisfies Config;
