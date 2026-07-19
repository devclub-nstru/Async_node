import {
  creatUserController,
  signInUserController,
  signOutUserController,
  sendVerificationCodeController,
  verifyEmailController,
  refreshAccessTokenController,
} from "./auth.controller.ts";
import router from "express";
import { authenticate } from "../../middlewares/auth.middleware.ts";
import { getMeController } from "./auth.controller.ts";
import { rateLimit } from "express-rate-limit";
import { ERROR_MESSAGES } from "../../constants/messages.ts";
import type { thttpError } from "../../types/types.ts";
import logger from "../../utils/logger.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { signupSchema, signinSchema } from "./auth.schema.ts";

export const authRouter = router.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per window on sensitive auth endpoints
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: (req, res) => {
    logger.warn(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, {
      status: 429,
      request: {
        ip: req.ip || "",
        method: req.method || "",
        url: req.url || "",
      },
    });

    const response: thttpError = {
      success: false,
      status: 429,
      message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
    };
    res.status(429).json(response);
  },
});

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signup", authLimiter, validate(signupSchema), creatUserController);

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SigninRequest'
 *     responses:
 *       200:
 *         description: Signed in successfully (tokens set as httpOnly cookies)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signin", authLimiter, validate(signinSchema), signInUserController);

/**
 * @openapi
 * /api/v1/auth/signout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign out the current user
 *     responses:
 *       200:
 *         description: Signed out successfully (cookies cleared)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signout", signOutUserController);

authRouter.post("/token/refresh", refreshAccessTokenController);
authRouter.post("/verify/send", authenticate, authLimiter, sendVerificationCodeController);
authRouter.post("/verify/confirm", authenticate, authLimiter, verifyEmailController);

authRouter.get("/me", authenticate, getMeController);
