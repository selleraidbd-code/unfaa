import { Card, CardContent } from "@workspace/ui/components/card";
import OTPVerifyForm from "@/features/auth/otp-form";

export default function VerifyEmail() {
    return (
        <div className="grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
            <Card>
                <CardContent className="pt-6">
                    <OTPVerifyForm />
                </CardContent>
            </Card>
        </div>
    );
}
