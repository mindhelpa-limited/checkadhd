"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer-radial-bg text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1 - Logo + Description */}
        <div>
          <Link href="/" className="flex items-center mb-4">
            <Image src="/logo.png" alt="ADHD Check Logo" width={32} height={32} className="h-8 w-auto" />
          </Link>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Evidence-based ADHD assessment and recovery program designed to support focus, calm, and progress.
          </p>
        </div>

        {/* Column 2 - Company */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Company</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Column 3 - Resources */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Resources</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Contact</h3>
          <p className="text-white/80 text-sm">support@adhdcheck.com</p>
          <p className="text-white/80 text-sm">+44 7869 467057</p>
        </div>
      </div>

      <div className="text-center text-white/40 text-sm py-6 border-t border-white/10">
        © {new Date().getFullYear()} ADHD Check. All rights reserved.
      </div>
      <style jsx>{`
        .footer-radial-bg {
          background-color: #0a122a;
          background-image: radial-gradient(
            circle at center,
            rgba(167, 139, 250, 0.1) 0%,
            transparent 60%
          );
        }
      `}</style>
    </footer>
  );
}