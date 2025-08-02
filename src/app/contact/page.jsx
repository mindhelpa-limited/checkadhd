"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import Footer from "../../components/home/Footer";
// --- Main Contact Page Component ---
export default function ContactPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">GET IN TOUCH</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            We’d Love to Hear From You
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Whether you have a question about our features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Contact Info & Image */}
          <div className="lg:pr-8">
            <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
            <p className="mt-4 text-lg text-gray-600">
              Reach out to us through any of the channels below. We look forward to connecting with you.
            </p>
            <div className="mt-10 space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">Our support team is available to help.</p>
                  <a href="mailto:support@adhdcheck.net" className="text-blue-600 font-semibold hover:underline">support@adhdcheck.net</a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Phone size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">Give us a call during business hours.</p>
                  <a href="tel:+447869467057" className="text-blue-600 font-semibold hover:underline">+44 7869 467057</a>
                </div>
              </div>
               <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Office</h3>
                  <p className="text-gray-600">Mindhelpa Limited<br/>1st Floor, North Westgate House, Harlow, CM20 1YS</p>
                </div>
              </div>
            </div>
            <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3132&auto=format&fit=crop"
                alt="Professional and welcoming office environment"
                className="mt-12 rounded-2xl shadow-xl w-full object-cover h-64"
            />
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form action="mailto:support@adhdcheck.net" method="POST" encType="text/plain">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">Full Name</label>
                <input type="text" name="name" id="name" autoComplete="name" className="mt-2 block w-full rounded-md border-0 px-3.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
              </div>
              <div className="mt-6">
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email Address</label>
                <input type="email" name="email" id="email" autoComplete="email" className="mt-2 block w-full rounded-md border-0 px-3.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600" />
              </div>
              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                <textarea name="message" id="message" rows={4} className="mt-2 block w-full rounded-md border-0 px-3.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600" defaultValue={""} />
              </div>
              <div className="mt-8">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
