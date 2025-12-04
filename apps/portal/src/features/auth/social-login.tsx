import { config } from "@/config";
import { GoogleLoginButton } from "@/features/auth/google-login-button";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const SocialLogin = () => {
    if (!config.googleClientId) {
        return null;
    }

    return (
        <form className="flex w-full flex-col items-center gap-4 py-4">
            <GoogleOAuthProvider clientId={config.googleClientId}>
                <GoogleLoginButton />
            </GoogleOAuthProvider>

            <div className="flex w-full items-center">
                <hr className="flex-1 border-t border-border-secondary/50" />

                <span className="mx-4 text-sm font-semibold text-muted-foreground">
                    Or
                </span>
                <hr className="flex-1 border-t border-border-secondary/50" />
            </div>
        </form>
    );
};
