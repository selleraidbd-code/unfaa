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

const TermsOfService = () => {
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
                            Terms of Service
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
                                    1. Agreement to Terms
                                </h2>
                                <p className="leading-relaxed">
                                    By accessing or using Unfaa Store ("the
                                    Service"), you agree to be bound by these
                                    Terms of Service ("Terms"). If you disagree
                                    with any part of these Terms, you may not
                                    access or use the Service.
                                </p>
                                <p className="leading-relaxed mt-3">
                                    These Terms apply to all users of the
                                    Service, including merchants, customers,
                                    visitors, and anyone else who accesses or
                                    uses the Service. Your use of the Service is
                                    also governed by our Privacy Policy, which
                                    is incorporated into these Terms by
                                    reference.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    2. Description of Service
                                </h2>
                                <p className="leading-relaxed">
                                    Unfaa Store provides a comprehensive
                                    platform for building and managing online
                                    stores and websites. Our Service includes:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Website builder tools and templates</li>
                                    <li>
                                        E-commerce functionality and store
                                        management
                                    </li>
                                    <li>
                                        Payment processing and order management
                                    </li>
                                    <li>Inventory and product management</li>
                                    <li>
                                        Customer relationship management tools
                                    </li>
                                    <li>Analytics and reporting features</li>
                                    <li>Hosting and domain services</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    3. Account Registration and Security
                                </h2>
                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    3.1 Account Creation
                                </h3>
                                <p className="leading-relaxed">
                                    To use certain features of the Service, you
                                    must register for an account. You agree to:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Provide accurate, current, and complete
                                        information
                                    </li>
                                    <li>
                                        Maintain and update your account
                                        information
                                    </li>
                                    <li>
                                        Maintain the security of your account
                                        credentials
                                    </li>
                                    <li>
                                        Accept responsibility for all activities
                                        under your account
                                    </li>
                                    <li>
                                        Notify us immediately of any
                                        unauthorized access
                                    </li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    3.2 Account Eligibility
                                </h3>
                                <p className="leading-relaxed">
                                    You must be at least 18 years old to create
                                    an account. By creating an account, you
                                    represent and warrant that you meet this age
                                    requirement and have the legal capacity to
                                    enter into these Terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    4. Acceptable Use
                                </h2>
                                <p className="leading-relaxed">
                                    You agree to use the Service only for lawful
                                    purposes and in accordance with these Terms.
                                    You agree NOT to:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Violate any applicable laws or
                                        regulations
                                    </li>
                                    <li>
                                        Infringe upon the rights of others
                                        (intellectual property, privacy, etc.)
                                    </li>
                                    <li>
                                        Transmit harmful, offensive, or illegal
                                        content
                                    </li>
                                    <li>
                                        Engage in fraudulent, deceptive, or
                                        misleading practices
                                    </li>
                                    <li>
                                        Interfere with or disrupt the Service or
                                        servers
                                    </li>
                                    <li>
                                        Attempt to gain unauthorized access to
                                        any part of the Service
                                    </li>
                                    <li>
                                        Use automated systems to access the
                                        Service without permission
                                    </li>
                                    <li>
                                        Resell or redistribute the Service
                                        without authorization
                                    </li>
                                    <li>
                                        Use the Service to compete with us or
                                        develop competing services
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    5. User Content and Intellectual Property
                                </h2>
                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    5.1 Your Content
                                </h3>
                                <p className="leading-relaxed">
                                    You retain ownership of any content you
                                    create, upload, or submit through the
                                    Service ("User Content"). By using the
                                    Service, you grant us a worldwide,
                                    non-exclusive, royalty-free license to use,
                                    store, and display your User Content solely
                                    for the purpose of providing and improving
                                    the Service.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    5.2 Our Intellectual Property
                                </h3>
                                <p className="leading-relaxed">
                                    The Service, including its original content,
                                    features, functionality, and design, is
                                    owned by Unfaa Store and protected by
                                    international copyright, trademark, and
                                    other intellectual property laws. You may
                                    not copy, modify, distribute, or create
                                    derivative works without our express written
                                    permission.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    5.3 Content Responsibility
                                </h3>
                                <p className="leading-relaxed">
                                    You are solely responsible for your User
                                    Content and its legality, reliability, and
                                    appropriateness. We reserve the right to
                                    remove any User Content that violates these
                                    Terms or is otherwise objectionable.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    6. Payment Terms
                                </h2>
                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    6.1 Subscription Fees
                                </h3>
                                <p className="leading-relaxed">
                                    Certain features of the Service require
                                    payment of subscription fees. You agree to
                                    pay all fees associated with your selected
                                    plan. Fees are billed in advance on a
                                    recurring basis (monthly or annually) and
                                    are non-refundable except as required by law
                                    or as stated in our refund policy.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    6.2 Payment Processing
                                </h3>
                                <p className="leading-relaxed">
                                    Payment processing is handled by third-party
                                    payment processors. You agree to provide
                                    accurate payment information and authorize
                                    us to charge your payment method for all
                                    fees.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    6.3 Price Changes
                                </h3>
                                <p className="leading-relaxed">
                                    We reserve the right to modify our pricing
                                    at any time. Price changes will be
                                    communicated to you in advance and will
                                    apply to subsequent billing cycles.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    6.4 Transaction Fees
                                </h3>
                                <p className="leading-relaxed">
                                    For e-commerce transactions processed
                                    through your store, payment processors may
                                    charge transaction fees. These fees are
                                    separate from subscription fees and are
                                    disclosed during the payment setup process.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    7. Service Availability and Modifications
                                </h2>
                                <p className="leading-relaxed">
                                    We strive to provide reliable service but do
                                    not guarantee uninterrupted or error-free
                                    operation. We reserve the right to:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Modify, suspend, or discontinue any part
                                        of the Service
                                    </li>
                                    <li>Perform maintenance and updates</li>
                                    <li>
                                        Restrict access to the Service for
                                        violations of these Terms
                                    </li>
                                    <li>
                                        Change features, functionality, or
                                        pricing
                                    </li>
                                </ul>
                                <p className="leading-relaxed mt-3">
                                    We will provide reasonable notice of
                                    significant changes when possible.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    8. Third-Party Services and Integrations
                                </h2>
                                <p className="leading-relaxed">
                                    The Service may integrate with or link to
                                    third-party services, applications, or
                                    websites. We are not responsible for the
                                    content, privacy practices, or terms of
                                    service of third-party services. Your use of
                                    third-party services is subject to their
                                    respective terms and conditions.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    9. Merchant Responsibilities
                                </h2>
                                <p className="leading-relaxed">
                                    If you use our Service to operate an online
                                    store, you agree to:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>
                                        Comply with all applicable laws and
                                        regulations
                                    </li>
                                    <li>
                                        Provide accurate product descriptions
                                        and pricing
                                    </li>
                                    <li>
                                        Honor all orders placed through your
                                        store
                                    </li>
                                    <li>
                                        Handle customer service and support for
                                        your store
                                    </li>
                                    <li>
                                        Process refunds and returns in
                                        accordance with your policies
                                    </li>
                                    <li>
                                        Maintain appropriate business licenses
                                        and permits
                                    </li>
                                    <li>Protect customer data and privacy</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    10. Termination
                                </h2>
                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    10.1 Termination by You
                                </h3>
                                <p className="leading-relaxed">
                                    You may terminate your account at any time
                                    by contacting us or using the account
                                    deletion feature. Upon termination, your
                                    access to the Service will cease, and your
                                    data will be handled in accordance with our
                                    data retention policies.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    10.2 Termination by Us
                                </h3>
                                <p className="leading-relaxed">
                                    We may suspend or terminate your account
                                    immediately if you violate these Terms,
                                    engage in fraudulent activity, or for any
                                    other reason we deem necessary to protect
                                    the Service or other users.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    10.3 Effect of Termination
                                </h3>
                                <p className="leading-relaxed">
                                    Upon termination, your right to use the
                                    Service will immediately cease. We are not
                                    obligated to retain your data after
                                    termination, and you are responsible for
                                    backing up your data before termination.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    11. Disclaimers and Limitation of Liability
                                </h2>
                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    11.1 Service "As Is"
                                </h3>
                                <p className="leading-relaxed">
                                    The Service is provided "as is" and "as
                                    available" without warranties of any kind,
                                    either express or implied. We do not warrant
                                    that the Service will be uninterrupted,
                                    secure, or error-free.
                                </p>

                                <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">
                                    11.2 Limitation of Liability
                                </h3>
                                <p className="leading-relaxed">
                                    To the maximum extent permitted by law,
                                    Unfaa Store shall not be liable for any
                                    indirect, incidental, special,
                                    consequential, or punitive damages, or any
                                    loss of profits or revenues, whether
                                    incurred directly or indirectly, or any loss
                                    of data, use, goodwill, or other intangible
                                    losses resulting from your use of the
                                    Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    12. Indemnification
                                </h2>
                                <p className="leading-relaxed">
                                    You agree to indemnify, defend, and hold
                                    harmless Unfaa Store and its officers,
                                    directors, employees, and agents from any
                                    claims, damages, losses, liabilities, and
                                    expenses (including legal fees) arising from
                                    your use of the Service, your User Content,
                                    your violation of these Terms, or your
                                    violation of any rights of another party.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    13. Dispute Resolution
                                </h2>
                                <p className="leading-relaxed">
                                    Any disputes arising from or relating to
                                    these Terms or the Service shall be resolved
                                    through binding arbitration in accordance
                                    with the rules of the applicable arbitration
                                    association, except where prohibited by law.
                                    You waive any right to participate in a
                                    class-action lawsuit or class-wide
                                    arbitration.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    14. Governing Law
                                </h2>
                                <p className="leading-relaxed">
                                    These Terms shall be governed by and
                                    construed in accordance with the laws of the
                                    jurisdiction in which Unfaa Store operates,
                                    without regard to its conflict of law
                                    provisions.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    15. Changes to Terms
                                </h2>
                                <p className="leading-relaxed">
                                    We reserve the right to modify these Terms
                                    at any time. We will notify you of material
                                    changes by posting the updated Terms on this
                                    page and updating the "Last Updated" date.
                                    Your continued use of the Service after such
                                    changes constitutes acceptance of the
                                    modified Terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    16. Severability
                                </h2>
                                <p className="leading-relaxed">
                                    If any provision of these Terms is found to
                                    be unenforceable or invalid, that provision
                                    shall be limited or eliminated to the
                                    minimum extent necessary, and the remaining
                                    provisions shall remain in full force and
                                    effect.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    17. Contact Information
                                </h2>
                                <p className="leading-relaxed">
                                    If you have any questions about these Terms
                                    of Service, please contact us at:
                                </p>
                                <div className="mt-3 p-4 bg-muted rounded-lg">
                                    <p className="font-semibold text-foreground">
                                        Unfaa Store
                                    </p>
                                    <Link
                                        href="mailto:unfaa9@gmail.com"
                                        className="text-muted-foreground hover:underline"
                                    >
                                        Email: unfaa9@gmail.com
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

export default TermsOfService;
