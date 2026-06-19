import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 3000 as number,


    DatabaseUrl:process.env.DATABASE_URL as string
}