"use client";
import { ShieldCheck, Database, Fingerprint, User, Mail } from "lucide-react";
import Footer from "../../components/home/Footer";
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

// --- Main Privacy Policy Page Component ---
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">OUR COMMITMENT TO YOU</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your privacy is our priority. This policy outlines how we collect, use, and protect your personal information.
          </p>
          <p className="mt-4 text-sm text-gray-500">Last updated: July 31, 2025</p>
        </div>
      </div>

      {/* --- Main Policy Content --- */}
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <PolicySection icon={<Database size={24} />} title="Information We Collect">
                <p>To provide our services, we collect the following types of information:</p>
                <ul>
                    <li><strong>Account Information:</strong> When you sign up, we collect your name, email address, and payment information.</li>
                    <li><strong>Assessment Data:</strong> Your answers to the ADHD assessment questions and the resulting scores and tiers.</li>
                    <li><strong>Usage Data:</strong> Information on how you interact with our daily recovery tasks and features, such as completion logs and streaks.</li>
                </ul>
            </PolicySection>

            <PolicySection icon={<Fingerprint size={24} />} title="How We Use Your Information">
                <p>Your data is used to power your experience and improve our services:</p>
                <ul>
                    <li>To create and manage your account and subscription.</li>
                    <li>To provide you with your personalized assessment results and daily recovery plan.</li>
                    <li>To track your progress and display it on your dashboard.</li>
                    <li>To communicate with you about your account and our services.</li>
                </ul>
            </PolicySection>
            
            <div className="my-16">
                <img 
                    src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2940&auto=format&fit=crop"
                    alt="A secure lock symbolizing data privacy"
                    className="rounded-2xl shadow-xl w-full h-64 object-cover"
                />
            </div>

            <PolicySection icon={<ShieldCheck size={24} />} title="Data Security">
                <p>We are committed to protecting your information. We implement a variety of security measures to maintain the safety of your personal data:</p>
                <ul>
                    <li>All payment information is processed securely by our payment partner, Stripe, and is never stored on our servers.</li>
                    <li>Your personal data is stored in a secure, encrypted database with restricted access.</li>
                    <li>We use industry-standard security protocols to protect your information during transmission.</li>
                </ul>
            </PolicySection>

            <PolicySection icon={<User size={24} />} title="Your Rights">
                <p>You have control over your personal data:</p>
                <ul>
                    <li>You can access and update your profile information at any time from your dashboard.</li>
                    <li>You can request a copy of your data or the deletion of your account by contacting our support team.</li>
                </ul>
            </PolicySection>

            <PolicySection icon={<Mail size={24} />} title="Contact Us">
                <p>If you have any questions about this Privacy Policy, please contact us. We are here to help.</p>
                <a href="/contact" className="text-blue-600 font-semibold hover:underline">Contact Support</a>
            </PolicySection>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
