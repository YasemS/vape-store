import { redirect } from "react-router";

import Container from "~/components/Container";

import type { Route } from "./+types/legal.$page";

export const meta: Route.MetaFunction = () => [
  {
    title: "Legal - AYVapes",
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const { page } = params;

  const pages = ["privacy", "refund", "shipping", "terms"];

  if (!pages.includes(page)) {
    return redirect("/");
  }

  return {
    page,
  };
}

export default function Legal({ loaderData }: Route.ComponentProps) {
  return (
    <div className="legal pt-8 px-4">
      <Container className="max-w-xl">
        {loaderData.page === "privacy" && <PrivacyPolicy />}
        {loaderData.page === "refund" && <RefundPolicy />}
        {loaderData.page === "shipping" && <ShippingPolicy />}
        {loaderData.page === "terms" && <TermsOfService />}
      </Container>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>Last updated: 1 June 2025</p>
      <p>
        Welcome to <strong>AYVapes</strong>. Your privacy is important to us.
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you visit our website{" "}
        <a href="https://www.ayvapes.com">https://www.ayvapes.com</a> (the
        “Site”).
      </p>
      <h2>1. Information We Collect</h2>
      <h3>a. Personal Information</h3>
      <p>When you make a purchase or create an account, we may collect:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing and shipping address</li>
        <li>Date of birth (for age verification)</li>
        <li>Payment details (processed securely by third-party providers)</li>
      </ul>
      <h3>b. Automatically Collected Information</h3>
      <p>
        We may collect data automatically when you access the Site, such as:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device type</li>
        <li>Pages visited</li>
        <li>Time spent on the Site</li>
      </ul>
      <h3>c. Cookies and Tracking Technologies</h3>
      <p>
        We use cookies and similar technologies to enhance your experience,
        analyze traffic, and personalize content and ads. You can adjust cookie
        settings through your browser.
      </p>
      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Process and deliver your orders</li>
        <li>Verify your age and identity</li>
        <li>Communicate with you about orders or promotions</li>
        <li>Improve our website and customer experience</li>
        <li>
          Send marketing and promotional emails (you may opt out at any time)
        </li>
        <li>Comply with legal obligations</li>
      </ul>
      <h2>3. Sharing Your Information</h2>
      <p>
        We do not sell your personal data. However, we may share your
        information with:
      </p>
      <ul>
        <li>Payment processors</li>
        <li>Shipping providers</li>
        <li>Marketing platforms (e.g. email services)</li>
        <li>Legal authorities when required</li>
      </ul>
      <p>
        All third-party providers are required to protect your data in
        compliance with this policy.
      </p>
      <h2>4. Age Restriction</h2>
      <p>
        AYVapes is intended for adults aged 21 and over. We do not knowingly
        collect data from individuals under 21. If we learn that we have
        collected personal information from a minor, we will delete it
        immediately.
      </p>
      <h2>5. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal data</li>
        <li>Object to or restrict certain data processing</li>
        <li>Withdraw consent for marketing communications</li>
        <li>File a complaint with a data protection authority</li>
      </ul>
      <p>
        To exercise your rights, contact us at{" "}
        <a href="mailto:support@ayvapes.com">support@ayvapes.com</a>.
      </p>
      <h2>6. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your
        information. However, no transmission over the internet is 100% secure.
      </p>
      <h2>7. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for their privacy practices. Please review their policies
        before submitting any personal data.
      </p>
      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with a revised "Last Updated" date. Continued use of
        the Site after changes implies your acceptance.
      </p>
      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle
        your data, please contact us:
      </p>
      <ul>
        <li>
          Email: <a href="mailto:support@ayvapes.com">support@ayvapes.com</a>
        </li>
        <li>Live Chat: Available during business hours on our website</li>
      </ul>
    </>
  );
}

function RefundPolicy() {
  return (
    <>
      <h1>Refund Policy</h1>
      <p>Last updated: 1 June 2025</p>
      <p>
        At <strong>AYVAPES</strong>, customer satisfaction is important to us.
        Please read our refund policy carefully before making a purchase.
      </p>
      <h2>Returns and Refunds</h2>
      <p>
        We accept returns and issue refunds only under the following conditions:
      </p>
      <ul>
        <li>
          The product must be{" "}
          <strong>unopened, unused, and in its original packaging</strong>.
        </li>
        <li>
          The return request must be made within <strong>14 days</strong> of the
          delivery date.
        </li>
      </ul>
      <h2>How to Request a Refund</h2>
      <p>
        To request a refund, please email us at{" "}
        <a href="mailto:support@ayvapes.com">support@ayvapes.com</a> with the
        following details:
      </p>
      <ul>
        <li>Your full name and order number</li>
        <li>Reason for the return</li>
        <li>Photos of the unopened product (if requested)</li>
      </ul>
      <p>
        Once your return is approved, we will provide you with return
        instructions. You will be responsible for return shipping costs unless
        the item is defective or incorrect.
      </p>
      <h2>Non-Refundable Items</h2>
      <p>We do not offer refunds on:</p>
      <ul>
        <li>Opened or used products</li>
        <li>Products returned after 14 days</li>
        <li>Perishable or hygienic items (if applicable)</li>
        <li>Gift cards or promotional items</li>
      </ul>
      <h2>Refund Processing</h2>
      <p>
        Once your return is received and inspected, we will notify you of the
        approval or rejection of your refund. Approved refunds will be issued to
        the original payment method within 5-10 business days.
      </p>
      <h2>Need Help?</h2>
      <p>
        If you have any questions about this policy or need assistance, please
        contact us at:
      </p>
      <ul>
        <li>
          Email: <a href="mailto:support@ayvapes.com">support@ayvapes.com</a>
        </li>
        <li>Live Chat: Available during business hours on our website</li>
      </ul>
    </>
  );
}

function ShippingPolicy() {
  return (
    <>
      <h1>Shipping Policy</h1>
      <p>Last updated: 11 June 2025</p>
      <p>
        At AYVAPES, we are committed to delivering your order quickly, safely,
        and discreetly. Please review our shipping policy below for full details
        on our shipping procedures.
      </p>
      <h2>Processing Time</h2>
      <p>
        All orders are usually processed within 1-2 business days (excluding
        weekends and holidays) after receiving your order confirmation email.
      </p>
      <p>
        You will receive another notification when your order has shipped.
        During high volume periods, processing may take slightly longer. If
        there is a significant delay, we will contact you via email.
      </p>
      <h2>Shipping Rates and Delivery Estimates</h2>
      <p>
        Shipping charges for your order will be calculated and displayed at
        checkout.
      </p>
      <p>We offer the following shipping options:</p>
      <ul>
        <li>Standard Shipping: 2-7 business days</li>
      </ul>
      <p>
        Delivery times are estimates and not guaranteed. Actual delivery may
        vary depending on location and courier delays.
      </p>
      <h2>Shipping Restrictions</h2>
      <p>
        Due to local laws and regulations, we do not ship to the following
        states or regions:
      </p>
      <ul>
        <li>Massachusetts</li>
        <li>Utah</li>
        <li>San Francisco</li>
      </ul>
      <p>
        We only ship to customers aged 21 or older. Age verification is required
        at checkout and/or upon delivery where applicable.
      </p>
      <h2>Order Tracking</h2>
      <p>
        Once your order is shipped, you will receive a confirmation email with a
        tracking number.
      </p>
      <p>
        You can track your order through the carrier's website using the
        provided tracking number.
      </p>
      <h2>Lost or Stolen Packages</h2>
      <p>
        AYVAPES is not responsible for lost or stolen packages that are
        confirmed as delivered to the address entered at checkout.
      </p>
      <p>
        If your package is missing, we recommend contacting the shipping carrier
        directly. We will also do our best to assist you in locating the
        package.
      </p>
      <h2>Incorrect Shipping Information</h2>
      <p>
        Please double-check your shipping details before placing your order.
      </p>
      <p>
        We are not responsible for delivery issues caused by incorrect or
        incomplete addresses submitted during checkout.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about your order or this shipping policy, you
        can contact our support team:
      </p>
      <ul>
        <li>
          Email: <a href="mailto:support@ayvapes.com">support@ayvapes.com</a>
        </li>
        <li>Live Chat: Available during business hours on our website</li>
      </ul>
    </>
  );
}

function TermsOfService() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>Last updated: 1 June 2025</p>
      <p>
        Welcome to <strong>AYVAPES</strong> (the "Site"). These Terms of Service
        ("Terms") govern your use of our website located at{" "}
        <a href="https://www.ayvapes.com">https://www.ayvapes.com</a> and any
        services or products offered through the Site.
      </p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Site, you agree to be bound by these Terms. If
        you do not agree to these Terms, do not use the Site.
      </p>
      <h2>2. Eligibility</h2>
      <p>
        You must be at least 21 years old to purchase or use products from
        AYVAPES. By using this Site, you confirm that you meet this age
        requirement.
      </p>
      <h2>3. Products and Orders</h2>
      <p>
        All orders are subject to availability and our acceptance. We reserve
        the right to refuse or cancel any order at our discretion. Prices are
        subject to change without notice.
      </p>
      <h2>4. Refunds and Returns</h2>
      <p>
        Please refer to our <a href="/legal/refund">Refund Policy</a> for
        information about returns and refunds. We only accept returns for
        unopened products within 14 days of delivery.
      </p>
      <h2>5. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site for any unlawful purpose</li>
        <li>
          Violate any local, national, or international laws or regulations
        </li>
        <li>Interfere with or disrupt the Site's operation</li>
        <li>Attempt to gain unauthorized access to any part of the Site</li>
      </ul>
      <h2>6. Intellectual Property</h2>
      <p>
        All content on the Site, including text, graphics, logos, and product
        images, is the property of AYVAPES or its licensors and is protected by
        intellectual property laws. You may not use any content without our
        express written permission.
      </p>
      <h2>7. Disclaimer of Warranties</h2>
      <p>
        The Site and all products are provided "as is" and "as available"
        without warranties of any kind. We make no warranties, express or
        implied, regarding the Site's operation or the accuracy of any
        information.
      </p>
      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, AYVAPES shall not be liable for
        any direct, indirect, incidental, or consequential damages resulting
        from your use of the Site or any product purchased through it.
      </p>
      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless AYVAPES and its affiliates from
        any claims, liabilities, damages, and expenses arising out of your use
        of the Site or your violation of these Terms.
      </p>
      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of
        the United States of America. Any disputes arising under these Terms
        shall be subject to the exclusive jurisdiction of the courts located in
        the United States of America.
      </p>
      <h2>11. Changes to Terms</h2>
      <p>
        We reserve the right to update or modify these Terms at any time.
        Changes will be posted on this page with an updated "Effective Date."
        Continued use of the Site after changes implies your acceptance.
      </p>
      <h2>12. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us:</p>
      <ul>
        <li>
          Email: <a href="mailto:support@ayvapes.com">support@ayvapes.com</a>
        </li>
        <li>Live Chat: Available during business hours on our website</li>
      </ul>
    </>
  );
}
