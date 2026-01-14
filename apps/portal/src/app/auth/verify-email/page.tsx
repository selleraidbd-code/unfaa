import OTPVerifyForm from "@/features/auth/otp-form";
import { Card, CardContent } from "@workspace/ui/components/card";

const Page = () => {
    return (
        <div className="grid h-svh flex-col items-center justify-center max-sm:px-4 lg:max-w-none lg:px-0">
            <Card>
                <CardContent className="pt-6">
                    <OTPVerifyForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
