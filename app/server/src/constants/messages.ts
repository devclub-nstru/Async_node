export const ERROR_MESSAGES = {
    // Auth
    USER_ALREADY_EXISTS: "User already exists",
    USER_NOT_FOUND: "User not found",
    INVALID_PASSWORD: "Username or password is incorrect",

    // Validation
    USERNAME_EMAIL_PASSWORD_REQUIRED: "Username, email and password are required",
    EMAIL_PASSWORD_REQUIRED: "Email and password are required",

    // Auth middleware
    UNAUTHORIZED: "Access token missing",
    INVALID_OR_EXPIRED_TOKEN: "Access token is invalid or expired",

    // Workflow
    WORKFLOW_NOT_FOUND: "Workflow not found",
    WORKFLOW_MISSING_FIELDS: "Name and description are required",
    WORKFLOW_INVALID_ID: "Invalid workflow ID",
    WORKFLOW_FORBIDDEN: "You do not have permission to delete this workflow",

    // Server
    INTERNAL_SERVER_ERROR: "Internal Server Error",

    //verification code
    VERIFICATION_CODE_EXPIRED: "Verification code has expired",
    INVALID_VERIFICATION_CODE: "Invalid verification code",
} as const;

export const SUCCESS_MESSAGES = {
    USER_CREATED: "User created successfully",
    USER_SIGNED_IN: "User signed in successfully",
    USER_SIGNED_OUT: "User signed out successfully",
    SERVER_RUNNING: "Server is up and running",

    // Workflow
    WORKFLOWS_RETRIEVED: "Workflows retrieved successfully",
    WORKFLOW_RETRIEVED: "Workflow retrieved successfully",
    WORKFLOW_CREATED: "Workflow created successfully",
    WORKFLOW_DELETED: "Workflow deleted successfully",
} as const;
