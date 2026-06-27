import { pgTable, serial, integer, varchar, jsonb, timestamp, pgEnum, text } from "drizzle-orm/pg-core";
import { users } from "./user.schema.ts";

export const workflowStatus = pgEnum("workflow_status", ["draft", "active", "completed"]);

export const workflows = pgTable("workflows", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    graphJson: jsonb("graph_json"),
    status: workflowStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})