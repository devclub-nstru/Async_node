import { pgTable, serial, text, varchar, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { workflows } from "./workflow.schema.ts";


export const integrations = pgTable("integrations",{
    id: serial("id").primaryKey(),
    workflowId: serial("workflow_id").notNull().references(() => workflows.id),
    provider: varchar("provider", { length: 255 }).notNull(),
    credentialsJson: jsonb("credentials_json").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})