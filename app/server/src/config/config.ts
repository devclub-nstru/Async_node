import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 3000 as number,

    //Database Configuration
    DatabaseUrl: process.env.DATABASE_URL as string,

    //JWT Configurations
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",

}