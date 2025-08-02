"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1 - Logo + Description */}
        <div>
          <Link href="/" className="flex items-center mb-4">
            <img src="/logo.png" alt="ADHD Check Logo" className="h-8" />
          </Link>
          <p className="text-sm text-gray-600 mt-3">
            Evidence-based ADHD assessment and recovery program designed to support focus, calm, and progress.
          </p>
        </div>

        {/* Column 2 - Company */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-800">Company</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="/about" className="hover:text-blue-600">About Us</a></li>
            <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
            <li><a href="/careers" className="hover:text-blue-600">Careers</a></li>
            <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
          </ul>
        </div>

        {/* Column 3 - Resources */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-800">Resources</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="/faq" className="hover:text-blue-600">FAQ</a></li>
            <li><a href="/pricing" className="hover:text-blue-600">Pricing</a></li>
            <li><a href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-800">Contact</h3>
          <p className="text-gray-700 text-sm">support@adhdcheck.com</p>
          <p className="text-gray-700 text-sm">+44 7869 467057</p>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-200">
        © {new Date().getFullYear()} ADHD Check. All rights reserved.
      </div>
    </footer>
  );
}
