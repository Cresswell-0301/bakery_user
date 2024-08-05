"use client";

import Loader from "@/components/Loader";
import PaymentForm from "@/components/PaymentForm";
import React, { useState } from "react";

const TnCPage = () => {
  const [loading, setLoading] = useState(false);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">
            Terms and Conditions
          </h1>

          <p className="mb-4">
            Welcome to o.oitsbakery. By accessing and using this website, you
            agree to comply with and be bound by the following terms and
            conditions. Please read these carefully before using our services.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By using this website, you agree to these Terms and Conditions in
            full. If you disagree with any part of these terms, please do not
            use our website.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            2. Changes to Website
          </h2>
          <p className="mb-4">
            o.oitsbakery reserves the right, at any time without prior notice to
            you, to change the format and content of the website at any time. By
            using this website, you agree in advance to accept any such changes.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            3. Use of Website
          </h2>
          <p className="mb-4">
            You agree to use this website only for lawful purposes and in a
            manner that does not infringe the rights of any third party. You
            must not use this site in any way that causes, or may cause, damage
            to the website or impairment of the availability or accessibility of
            the website.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            4. Products and Services
          </h2>
          <p className="mb-4">
            All products and services are subject to availability. We reserve
            the right to discontinue any product or service at any time.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            5. Pricing and Payment
          </h2>
          <p className="mb-4">
            All prices listed on the website are subject to change without
            notice. Payment for all purchases must be made in full at the time
            of ordering.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">6. Delivery</h2>
          <p className="mb-4">
            We will make every effort to deliver products within the stated
            timeframes, but we cannot guarantee delivery times. Any delivery
            dates provided are estimates only.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            7. Returns and Refunds
          </h2>
          <p className="mb-4">
            Please refer to our separate Returns and Refunds Policy for
            information on returns, exchanges, and refunds.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">8. Privacy</h2>
          <p className="mb-4">
            Your use of this website is also governed by our Privacy Policy,
            which is incorporated into these terms and conditions by reference.
          </p>

          <h2 className="text-2xl font-semibold mb-3 mt-6">
            9. Limitation of Liability
          </h2>
          <p className="mb-4">
            o.oitsbakery will not be liable for any indirect, special or
            consequential loss or damage arising from your use of this website.
          </p>

          {/* <h2 className="text-2xl font-semibold mb-3 mt-6">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms and Conditions, please
            contact us at [Your Contact Information].
          </p> */}
        </div>
      </div>
    </>
  );
};

export default TnCPage;
