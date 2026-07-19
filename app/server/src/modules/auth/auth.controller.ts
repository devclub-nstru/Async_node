import { httpError } from "../../utils/httpError.ts";
import { httpResponse } from "../../utils/httpResponse.ts";
import {
  createUser,
  emailVerified,
  signInUser,
  signOutUser,
  verifyEmail,
  refreshAccessToken,
} from "./auth.services.ts";
import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.ts";
import { verifyRefreshToken } from "../../utils/tokens.ts";
import { config } from "../../config/config.ts";
import crypto from "crypto";

const cookieBase = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: (config.isProduction ? "strict" : "lax") as "strict" | "lax",
};

const COOKIE_ENCRYPTION_SECRET = process.env.COOKIE_ENCRYPTION_SECRET ?? "";

const encryptCookieValue = (value: string): string => {
  if (!COOKIE_ENCRYPTION_SECRET) {
    throw new Error("COOKIE_ENCRYPTION_SECRET is not configured");
  }

  const key = crypto.createHash("sha256").update(COOKIE_ENCRYPTION_SECRET).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64url")}:${tag.toString("base64url")}:${encrypted.toString("base64url")}`;
};

export const creatUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const result = await createUser(username, email, password);
    if (result instanceof Error) {
      return httpError(next, req, 400, result.message);
    }

    return httpResponse(res, req, 201, SUCCESS_MESSAGES.USER_CREATED);
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const signInUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await signInUser(email, password);

    if (result instanceof Error) {
      return httpError(next, req, 401, result.message);
    }

    const tokens = result as { accessToken: string; refreshToken: string; isVerified: boolean };
    const encryptedAccessToken = encryptCookieValue(tokens.accessToken);
    const encryptedRefreshToken = encryptCookieValue(tokens.refreshToken);

    res.cookie("accessToken", encryptedAccessToken, { ...cookieBase, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", encryptedRefreshToken, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return httpResponse(res, req, 200, SUCCESS_MESSAGES.USER_SIGNED_IN, {
      isVerified: tokens.isVerified,
    });
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

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

    res.clearCookie("accessToken", cookieBase);
    res.clearCookie("refreshToken", cookieBase);

    return httpResponse(res, req, 200, SUCCESS_MESSAGES.USER_SIGNED_OUT);
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const sendVerificationCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const result = await verifyEmail(email);

    if (result instanceof Error) {
      return httpError(next, req, 500, result.message);
    }

    return httpResponse(res, req, 200, "Verification code sent successfully");
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const refreshAccessTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      return httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const result = await refreshAccessToken(refreshToken);

    if (result instanceof Error) {
      return httpError(next, req, 401, result.message);
    }

    const { accessToken } = result as { accessToken: string };

    res.cookie("accessToken", accessToken, { ...cookieBase, maxAge: 15 * 60 * 1000 });

    return httpResponse(res, req, 200, SUCCESS_MESSAGES.USER_SIGNED_IN);
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.user?.email;
    const { code } = req.body;

    if (!email) {
      return httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!code) {
      return httpError(next, req, 400, "Verification code is required");
    }

    const result = await emailVerified(email, code);

    if (result instanceof Error) {
      return httpError(next, req, 400, result.message);
    }

    const { accessToken } = result as { accessToken: string };
    res.cookie("accessToken", accessToken, { ...cookieBase, maxAge: 15 * 60 * 1000 });

    return httpResponse(res, req, 200, "Email verified successfully");
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    return httpResponse(res, req, 200, "User retrieved successfully", { user });
  } catch (err: Error | unknown) {
    return httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, null, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
