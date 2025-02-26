import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get database connection string from .env file or use a default for local development
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo_db';

// Create postgres client
const client = postgres(connectionString);

// Create drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export the schema
export * from "./schema";
