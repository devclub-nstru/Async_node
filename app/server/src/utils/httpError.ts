import type { thttpError } from "../types/types.js";
import type { Request, Response, NextFunction } from "express";

export const httpError = (
    next:NextFunction,
    req: Request,
    status: number,
    message: string,
    data?: unknown,
    trace?: object | null,
    
) => {
    const response: thttpError = {
        success: false,
        status,
        message,
        request: {
            ip: req.ip || "",
            method: req.method || "",
            url: req.url || "",
        },
        data,
        trace: trace ?? null,
    };

    //loging
    console.log(response)

    return next(response);
};
