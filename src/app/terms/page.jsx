"use client";
import { FileText, User, CreditCard, Shield, MessageSquare, AlertTriangle } from "lucide-react";
import Footer from "@/components/home/Footer"; // Assuming your Footer component is here

// --- Policy Section Component ---
const PolicySection = ({ icon, title, children }) => (
    <div className="flex items-start mt-12">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
            {icon}
        </div>
        <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <div className="mt-4 prose prose-lg text-gray-600 max-w-none">
                {children}
            </div>
        </div>
    </div>
);

// --- Main Terms of Service Page Component ---
export default function TermsOfServicePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">LEGAL FRAMEWORK</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Please read these terms carefully before using our service. By using ADHD Check, you agree to be bound by these terms.
          </p>
          <p className="mt-4 text-sm text-gray-500">Last updated: July 31, 2025</p>
        </div>
      </div>

      {/* --- Main Policy Content --- */}
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <PolicySection icon={<User size={24} />} title="1. Your Account">
                <p>You must be 18 years or older to use this service. You are responsible for maintaining the security of your account and password. ADHD Check cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
            </PolicySection>

            <PolicySection icon={<CreditCard size={24} />} title="2. Subscription and Billing">
                <p>Our premium service is billed on a subscription basis. You will be billed in advance on a recurring, periodic basis (each month). Your subscription will automatically renew at the end of each billing cycle unless you cancel it through your profile page.</p>
            </PolicySection>

            <PolicySection icon={<AlertTriangle size={24} />} title="3. Medical Disclaimer">
                <p>ADHD Check provides tools and content for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            </PolicySection>

            <PolicySection icon={<Shield size={24} />} title="4. Intellectual Property">
                <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Mindhelpa Limited and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>
            </PolicySection>

            <PolicySection icon={<MessageSquare size={24} />} title="5. Contact Us">
                <p>If you have any questions about these Terms, please contact us. We are committed to providing a clear and transparent service.</p>
                <a href="/contact" className="text-blue-600 font-semibold hover:underline">Contact Support</a>
            </PolicySection>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
