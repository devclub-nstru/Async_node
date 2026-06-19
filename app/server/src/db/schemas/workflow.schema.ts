import { pgTable, serial, text, varchar, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user.schema.ts";

export const workflowStatus = pgEnum("workflow_status", ["draft", "active", "completed"]);

export const workflows = pgTable("workflows", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").notNull().references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    graphJson: jsonb("graph_json").notNull(),
    status: workflowStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})