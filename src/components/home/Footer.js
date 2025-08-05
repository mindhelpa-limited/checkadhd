"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1 - Logo + Description */}
        <div>
          <Link href="/" className="flex items-center mb-4">
            <img src="/logo.png" alt="ADHD Check Logo" className="h-8" />
          </Link>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Evidence-based ADHD assessment and recovery program designed to support focus, calm, and progress.
          </p>
        </div>

        {/* Column 2 - Company */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Company</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link href="/about" className="hover:text-focus-gold">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-focus-gold">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-focus-gold">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-focus-gold">Blog</Link></li>
          </ul>
        </div>

        {/* Column 3 - Resources */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Resources</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link href="/faq" className="hover:text-focus-gold">FAQ</Link></li>
            <li><Link href="/pricing" className="hover:text-focus-gold">Pricing</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-focus-gold">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-focus-gold">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Contact</h3>
          <p className="text-white/80 text-sm">support@adhdcheck.com</p>
          <p className="text-white/80 text-sm">+44 7869 467057</p>
        </div>
      </div>

      <div className="text-center text-white/40 text-sm py-6 border-t border-gray-800">
        © {new Date().getFullYear()} ADHD Check. All rights reserved.
      </div>
    </footer>
  );
}