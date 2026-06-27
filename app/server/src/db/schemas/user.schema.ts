import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: serial("id").primaryKey(),
    name:varchar("name", { length: 255 }).notNull(),
    email:varchar("email", { length: 255 }).notNull().unique(),
    password:text("password").notNull(),
    refreshToken:text("refresh_token"),
    createdAt: text("created_at").notNull().default(new Date().toISOString()),
    updatedAt: text("updated_at").notNull().default(new Date().toISOString())
    
})