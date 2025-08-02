"use client";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function Assessment() {
  const router = useRouter();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop" 
              alt="A person sitting calmly and reading a book, representing focus and clarity."
              className="rounded-3xl shadow-2xl object-cover w-full h-full"
            />
          </div>

          {/* Text Content Section */}
          <div>
            <span className="text-blue-600 font-semibold tracking-wider uppercase">
              The First Step
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Gain a Deeper Understanding of Your Mind
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Our assessment is more than just a quiz. It's a comprehensive tool, built upon established clinical frameworks like the ASRS and DSM-5 criteria, to provide you with a clear and insightful look into your unique cognitive patterns.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Clinically-Informed</h3>
                  <p className="text-gray-600">Questions designed to provide a meaningful and accurate baseline.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Personalized Insights</h3>
                  <p className="text-gray-600">Receive a detailed report that forms the foundation for your recovery plan.</p>
                </div>
              </li>
            </ul>
            <button 
              onClick={() => router.push('/assessment')}
              className="mt-10 bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Take a Free Snippet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
