import type { TokenPayload } from "../utils/tokens.ts";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export type thttpResponse = {
    success:boolean,
    status:number,
    message:string,
    data?:unknown,
    request:{
        ip?:string,
        method?:string,
        url?:string

    }

}

export type thttpError= {
    success:boolean,
    status:number,
    request:{
        ip?:string,
        method?:string,
        url?:string
    }
    message:string,
    data?:unknown,
    trace:object | null


}

export enum NodeType {
  OPENAI = "openai",
  GROQ = "groq",
  ANTHROPIC = "anthropic",
  HTTP = "http",
  SLACK = "slack",
  EMAIL = "email"
}

export interface WorkflowNode {
  id: string;

  type: string;

  connectionId?: string;

  data: Record<string, any>;
}

