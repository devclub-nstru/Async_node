import bcrypt from "bcryptjs";
import { users } from "../../db/schemas/user.schema.ts";
import { db } from "../../config/db.ts";
import {getUserByEmail} from "./auth.repo.ts"
import {eq} from "drizzle-orm";

import {generateAccessToken} from "../../utils/tokens.ts";
import {generateRefreshToken} from "../../utils/tokens.ts";
import { ERROR_MESSAGES } from "../../constants/messages.ts";

export const createUser = async (name: string, email: string, password: string) => {
  
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }
        const result = await db.insert(users).values({
            name,
            email,
            password: hashedPassword
        })
    }catch(err){
        return err;
    }
  
}

export const signInUser = async(email:string,password:string)=>{
    try{
        const user = await getUserByEmail(email);
        if(user === null){
            return new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return new Error(ERROR_MESSAGES.INVALID_PASSWORD);
        }

        const accessToken = generateAccessToken({userId:user.id, email,name:user.name});
        const refreshToken = generateRefreshToken({userId: user.id, email, name:user.name});
    
        await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));


        return {accessToken, refreshToken} as { accessToken: string; refreshToken: string };
    }catch(err){
        return err
    }
}

