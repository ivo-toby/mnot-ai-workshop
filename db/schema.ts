import { pgTable, serial, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

// Define the todos table schema
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).default('Uncategorized').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define the types based on the schema
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
