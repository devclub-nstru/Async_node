import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {config} from "./config.ts";


const sql = neon(config.DatabaseUrl); // Use the DATABASE_URL from the config file
export const db = drizzle({ client: sql });