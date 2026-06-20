export const ERROR_MESSAGES = {
    // Auth
    USER_ALREADY_EXISTS: "User already exists",
    USER_NOT_FOUND: "User not found",
    INVALID_PASSWORD: "Invalid password",

    // Validation
    USERNAME_EMAIL_PASSWORD_REQUIRED: "Username, email and password are required",
    EMAIL_PASSWORD_REQUIRED: "Email and password are required",

    // Server
    INTERNAL_SERVER_ERROR: "Internal Server Error",
} as const;

export const SUCCESS_MESSAGES = {
    USER_CREATED: "User created successfully",
    USER_SIGNED_IN: "User signed in successfully",
    SERVER_RUNNING: "Server is up and running",
} as const;
