export const config = {
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN || "unfaa.com",
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV || "development",
    fraudCheckerApiKey: process.env.NEXT_PUBLIC_FRAUD_CHECKER_API_KEY,
    googleClientId: process.env.AUTH_GOOGLE_ID,
    googleClientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
};
