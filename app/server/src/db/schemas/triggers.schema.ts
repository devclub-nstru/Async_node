import { pgTable, serial, integer, varchar, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { workflows } from "./workflow.schema.ts";

export const isActiveEnum = pgEnum("is_active", ["true", "false"]);

export const triggers = pgTable("triggers",{
    id: serial("id").primaryKey(),
    workflowId: integer("workflow_id").notNull().references(() => workflows.id),
    nodeId: varchar("node_id", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    configJson: jsonb("config_json").notNull(),
    isActive: isActiveEnum("is_active").notNull().default("true"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

