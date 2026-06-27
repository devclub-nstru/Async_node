import {httpError} from '../../utils/httpError.ts';
import {httpResponse} from '../../utils/httpResponse.ts';
import {createUser, signInUser, signOutUser} from './auth.services.ts';
import type { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages.ts';
import { verifyRefreshToken } from '../../utils/tokens.ts';

export const creatUserController = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return httpError(
                next,
                req,
                400,
                ERROR_MESSAGES.USERNAME_EMAIL_PASSWORD_REQUIRED
            );
        }


        const result = await createUser(username,email,password);
        if(result instanceof Error){
            return httpError(next, req, 400, result.message);
        }

        return httpResponse(
            res,
            req,
            201,
            SUCCESS_MESSAGES.USER_CREATED,
        );

    }catch(err:Error | unknown){
        return httpError(
            next,
            req,
            500,
            ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            null,
            {error: err instanceof Error ? err.message : String(err)}
        );
    }
}


export const signInUserController = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return httpError(
                next,
                req,
                400,
                ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED
            );
        }

        const result = await signInUser(email, password);

        if (result instanceof Error) {
            return httpError(next, req, 401, result.message);
        }

        const tokens = result as { accessToken: string; refreshToken: string };

        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return httpResponse(
            res,
            req,
            200,
            SUCCESS_MESSAGES.USER_SIGNED_IN,
        );

    }catch(err:Error | unknown){
        return httpError(
            next,
            req,
            500,
            ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            null,
            {error: err instanceof Error ? err.message : String(err)}
        );
    }
}

export const signOutUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken as string | undefined;

        if (refreshToken) {
            try {
                const payload = verifyRefreshToken(refreshToken);
                await signOutUser(payload.userId);
            } catch {
                // token invalid/expired — still clear cookies
            }
        }

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

        return httpResponse(res, req, 200, SUCCESS_MESSAGES.USER_SIGNED_OUT);
    } catch (err: Error | unknown) {
        return httpError(
            next,
            req,
            500,
            ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            null,
            { error: err instanceof Error ? err.message : String(err) }
        );
    }
};



