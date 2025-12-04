import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/icons/logo.svg";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-svh bg-muted sm:py-6 lg:py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl max-md:rounded-none border-0 bg-background/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <Link href="/">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={100}
                                height={40}
                                className="mx-auto flex items-center justify-center mb-4"
                            />
                        </Link>
                        <CardTitle className="text-3xl italic bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Privacy Policy
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-base mt-2">
                            Last Updated:{" "}
                            {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-slate max-w-none px-6 pb-8 dark:prose-invert">
                        <div className="space-y-6 text-foreground">
                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    1. Introduction
                                </h2>
                                <p className="leading-relaxed">
                                    Welcome to Unfaa Store ("we," "our," or
                                    "us"). We are committed to protecting your
                                    privacy and ensuring the security of your
                                    personal information. This Privacy Policy
                                    explains how we collect, use, disclose, and
                                    safeguard your information when you use our
                                    website builder and e-commerce business
                                    solutions platform (the "Service").
                                </p>
                                <p className="leading-relaxed mt-3">
                                    By accessing or using our Service, you agree
                                    to the collection and use of information in
                                    accordance with this Privacy Policy. If you
                                    do not agree with our policies and
                                    practices, please do not use our Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    2. Information We Collect
                                </h2>
                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    2.1 Personal Information
                                </h3>
                                <p className="leading-relaxed">
                                    We collect information that you provide
                                    directly to us, including:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Name, email address, and contact
                                        information
                                    </li>
                                    <li>
                                        Account credentials and authentication
                                        information
                                    </li>
                                    <li>Payment and billing information</li>
                                    <li>
                                        Business information (store name,
                                        address, tax information)
                                    </li>
                                    <li>Customer support communications</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    2.2 Automatically Collected Information
                                </h3>
                                <p className="leading-relaxed">
                                    When you use our Service, we automatically
                                    collect certain information, including:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Device information (IP address, browser
                                        type, operating system)
                                    </li>
                                    <li>
                                        Usage data (pages visited, features
                                        used, time spent)
                                    </li>
                                    <li>
                                        Cookies and similar tracking
                                        technologies
                                    </li>
                                    <li>Log files and analytics data</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    2.3 Customer Data
                                </h3>
                                <p className="leading-relaxed">
                                    As a platform provider, we process data on
                                    behalf of our customers (merchants) who use
                                    our Service to operate their online stores.
                                    This includes customer information, order
                                    data, and transaction details collected by
                                    merchants through their stores.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    3. How We Use Your Information
                                </h2>
                                <p className="leading-relaxed">
                                    We use the collected information for various
                                    purposes:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        To provide, maintain, and improve our
                                        Service
                                    </li>
                                    <li>
                                        To process transactions and manage your
                                        account
                                    </li>
                                    <li>
                                        To send you service-related
                                        communications
                                    </li>
                                    <li>
                                        To respond to your inquiries and provide
                                        customer support
                                    </li>
                                    <li>
                                        To detect, prevent, and address
                                        technical issues and security threats
                                    </li>
                                    <li>
                                        To comply with legal obligations and
                                        enforce our terms
                                    </li>
                                    <li>
                                        To analyze usage patterns and improve
                                        user experience
                                    </li>
                                    <li>
                                        To send marketing communications (with
                                        your consent)
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    4. Data Sharing and Disclosure
                                </h2>
                                <p className="leading-relaxed">
                                    We may share your information in the
                                    following circumstances:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        <strong>Service Providers:</strong> We
                                        share data with third-party service
                                        providers who assist in operating our
                                        Service (payment processors, hosting
                                        providers, analytics services)
                                    </li>
                                    <li>
                                        <strong>Business Transfers:</strong>{" "}
                                        Information may be transferred in
                                        connection with mergers, acquisitions,
                                        or asset sales
                                    </li>
                                    <li>
                                        <strong>Legal Requirements:</strong> We
                                        may disclose information if required by
                                        law or to protect our rights and safety
                                    </li>
                                    <li>
                                        <strong>With Your Consent:</strong> We
                                        may share information with your explicit
                                        consent
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    5. Data Security
                                </h2>
                                <p className="leading-relaxed">
                                    We implement industry-standard security
                                    measures to protect your information,
                                    including:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Encryption of data in transit and at
                                        rest
                                    </li>
                                    <li>
                                        Regular security assessments and updates
                                    </li>
                                    <li>
                                        Access controls and authentication
                                        mechanisms
                                    </li>
                                    <li>Secure payment processing</li>
                                </ul>
                                <p className="leading-relaxed mt-3">
                                    However, no method of transmission over the
                                    Internet or electronic storage is 100%
                                    secure. While we strive to protect your
                                    data, we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    6. Your Rights and Choices
                                </h2>
                                <p className="leading-relaxed">
                                    Depending on your location, you may have the
                                    following rights:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        <strong>Access:</strong> Request access
                                        to your personal information
                                    </li>
                                    <li>
                                        <strong>Correction:</strong> Request
                                        correction of inaccurate data
                                    </li>
                                    <li>
                                        <strong>Deletion:</strong> Request
                                        deletion of your personal information
                                    </li>
                                    <li>
                                        <strong>Portability:</strong> Request
                                        transfer of your data to another service
                                    </li>
                                    <li>
                                        <strong>Opt-Out:</strong> Unsubscribe
                                        from marketing communications
                                    </li>
                                    <li>
                                        <strong>Cookie Preferences:</strong>{" "}
                                        Manage cookie settings through your
                                        browser
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    7. Cookies and Tracking Technologies
                                </h2>
                                <p className="leading-relaxed">
                                    We use cookies and similar technologies to
                                    enhance your experience, analyze usage, and
                                    assist with marketing efforts. You can
                                    control cookies through your browser
                                    settings, though this may affect Service
                                    functionality.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    8. Data Retention
                                </h2>
                                <p className="leading-relaxed">
                                    We retain your personal information for as
                                    long as necessary to fulfill the purposes
                                    outlined in this Privacy Policy, unless a
                                    longer retention period is required or
                                    permitted by law. When you delete your
                                    account, we will delete or anonymize your
                                    data in accordance with our data retention
                                    policies.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    9. Children's Privacy
                                </h2>
                                <p className="leading-relaxed">
                                    Our Service is not intended for individuals
                                    under the age of 18. We do not knowingly
                                    collect personal information from children.
                                    If you believe we have collected information
                                    from a child, please contact us immediately.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    10. International Data Transfers
                                </h2>
                                <p className="leading-relaxed">
                                    Your information may be transferred to and
                                    processed in countries other than your
                                    country of residence. We ensure appropriate
                                    safeguards are in place to protect your data
                                    in accordance with this Privacy Policy and
                                    applicable data protection laws.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    11. Changes to This Privacy Policy
                                </h2>
                                <p className="leading-relaxed">
                                    We may update this Privacy Policy from time
                                    to time. We will notify you of any material
                                    changes by posting the new Privacy Policy on
                                    this page and updating the "Last Updated"
                                    date. You are advised to review this Privacy
                                    Policy periodically for any changes.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    12. Contact Us
                                </h2>
                                <p className="leading-relaxed">
                                    If you have any questions about this Privacy
                                    Policy or our data practices, please contact
                                    us at:
                                </p>
                                <div className="mt-3 p-4 bg-muted rounded-lg">
                                    <p className="font-semibold text-foreground">
                                        Unfaa Store
                                    </p>
                                    <Link
                                        href="mailto:unfaa9@gmail.com"
                                        className="text-muted-foreground group"
                                    >
                                        Email:{" "}
                                        <span className="text-primary group-hover:text-primary group-hover:underline">
                                            unfaa9@gmail.com
                                        </span>
                                    </Link>
                                    <p className="text-muted-foreground">
                                        Website:{" "}
                                        <Link
                                            href="https://unfaa.com/"
                                            className="text-primary hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            https://unfaa.com/
                                        </Link>
                                    </p>
                                </div>
                            </section>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
