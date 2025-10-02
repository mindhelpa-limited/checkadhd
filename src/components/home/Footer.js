"use client";
import Link from "next/link";
import Image from "next/image";
// 1. Import icons from react-icons/fa (Font Awesome)
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
// X (formerly Twitter) icon is found under react-icons/fa6
import { FaXTwitter } from 'react-icons/fa6'; 

// Component for a reusable social media link
const SocialIcon = ({ href, children, platform }) => (
  <Link 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-blue-400 transition-colors p-1" // Added padding for better click area
    aria-label={`${platform} link`}
  >
    {children}
  </Link>
);


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-radial-bg text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1 - Logo + Description + Social Media */}
        <div>
          <Link href="/" className="flex items-center mb-4">
            <Image src="/logo.png" alt="ADHD Check Logo" width={32} height={32} className="h-8 w-auto" unoptimized />
          </Link>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Mental Health Screening, Evaluation Assessment and Recovery. Take charge of your mental health with our Recovery tools and crush your personal goals using our Psychiatrist-Led Coaching.
          </p>
          
          {/* Social Media Links - NOW USING REAL ICONS */}
          <div className="flex space-x-4 mt-6">
            <SocialIcon href="https://instagram.com/mindhelpa" platform="Instagram">
              <FaInstagram size={20} />
            </SocialIcon>
            <SocialIcon href="https://facebook.com/mindhelpa" platform="Facebook">
              <FaFacebookF size={20} />
            </SocialIcon>
            <SocialIcon href="https://x.com/mindhelpa" platform="X (Twitter)">
              <FaXTwitter size={20} />
            </SocialIcon>
            <SocialIcon href="http://www.youtube.com/@mindhelpa" platform="YouTube">
              <FaYoutube size={20} />
            </SocialIcon>
          </div>
        </div>

        {/* Column 2 - Services */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Services</h3> 
          <ul className="space-y-3 text-white/80">
            <li><Link href="/adhdcheck" className="hover:text-blue-400 transition-colors">ADHD self assessment</Link></li>
            <li><Link href="/pricing-adhd-clinical-assessment" className="hover:text-blue-400 transition-colors">ADHD Clinical assessment</Link></li>
            <li><Link href="/pricing-mental-health-recovery-tools" className="hover:text-blue-400 transition-colors">Mental health recovery</Link></li>
            <li><Link href="/pricing-mental-health-recovery-tools" className="hover:text-blue-400 transition-colors">Goal tracker tool</Link></li>
            <li><Link href="/book-a-coach" className="hover:text-blue-400 transition-colors">Psychiatrist coaching</Link></li>
          </ul>
        </div>

        {/* Column 3 - Resources (Contains Privacy and Terms) */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Resources</h3>
          <ul className="space-y-3 text-white/80">
            <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h3 className="text-md font-semibold mb-4 text-white">Contact</h3>
          <p className="text-white/80 text-sm">support@mindhelpa.com</p>
          <p className="text-white/80 text-sm">+44 7869 467057</p>
        </div>
      </div>

      <div className="text-center text-white/40 text-sm py-6 border-t border-white/10">
        {/* Updated copyright text to Mindhelpa Limited and used dynamic year */}
        © {currentYear} Mindhelpa Limited. All rights reserved.
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