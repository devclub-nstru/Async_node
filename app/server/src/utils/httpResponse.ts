import type { thttpResponse } from "../types/types.js";
import type { Request, Response } from "express";

export const httpResponse = (res:Response,req:Request,status:number,message:string,data?:unknown)=>{
    const response:thttpResponse={
        success:true,
        status,
        message,
        request:{
            ip:req.ip || "",
            method:req.method || "",
            url:req.url || "",
        },
        data,
    }

    //loging
    console.log(response);

    return res.status(status).json(response);

}

