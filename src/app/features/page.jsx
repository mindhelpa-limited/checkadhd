"use client";
import { CheckCircle2, BrainCircuit, BarChart3, CalendarDays, ArrowRight } from "lucide-react";
import Footer from "../../components/home/Footer";
// --- Feature Highlight Component ---
const FeatureHighlight = ({ icon, title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">{title}</h3>
    <p className="mt-2 text-gray-600 text-center">{children}</p>
  </div>
);

// --- Main Features Page Component ---
export default function FeaturesPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* --- Hero Section --- */}
      <div className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1508317468185-b3d3d3a3c6a7?q=80&w=2874&auto=format&fit=crop" 
                alt="A clear path forward" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 px-4 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Engineered for <span className="text-blue-400">Clarity and Growth</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            Discover the powerful, science-backed features designed to transform the way you manage ADHD.
          </p>
        </div>
      </div>

      {/* --- Feature Highlights Section --- */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureHighlight icon={<CheckCircle2 size={32} />} title="Clinically-Informed">
              Our methods are grounded in established frameworks like the ASRS & DSM-5 criteria.
            </FeatureHighlight>
            <FeatureHighlight icon={<BrainCircuit size={32} />} title="AI-Personalized">
              Receive unique, AI-generated content daily, tailored to help you build focus and routine.
            </FeatureHighlight>
            <FeatureHighlight icon={<BarChart3 size={32} />} title="Visually Motivating">
              Track your progress with an interactive calendar and streak counters that celebrate your consistency.
            </FeatureHighlight>
          </div>
        </div>
      </div>

      {/* --- Detailed Feature Section 1 (Daily Plan) --- */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-semibold tracking-wider uppercase">THE CORE EXPERIENCE</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-900">Your Daily Recovery Plan</h2>
            <p className="text-gray-600 mb-6 text-lg">
              The heart of our platform is a personalized set of five daily tasks. This gamified structure helps build the consistency and routines crucial for managing ADHD, turning daily practice into a rewarding experience.
            </p>
            <a href="/how-it-works" className="font-semibold text-blue-600 flex items-center group">
                See the 3-step process <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="text-center">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2720&auto=format&fit=crop" alt="Person doing a calming yoga pose" className="rounded-2xl shadow-xl mx-auto" />
          </div>
        </div>
      </div>
      
      {/* --- Detailed Feature Section 2 (Progress Tracking) --- */}
       <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
           <div className="text-center md:order-2">
             <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2940&auto=format&fit=crop" alt="Journal and charts showing progress" className="rounded-2xl shadow-xl mx-auto" />
          </div>
          <div className="md:order-1">
            <span className="text-green-600 font-semibold tracking-wider uppercase">STAY MOTIVATED</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-900">Visualize Your Success</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Our progress page makes it easy and rewarding to see how far you've come. Celebrate your consistency with an interactive calendar and streak counters that inspire you to keep building positive momentum.
            </p>
             <a href="/dashboard/progress" className="font-semibold text-green-600 flex items-center group">
                View a sample dashboard <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* --- CTA Section --- */}
      <div className="bg-gray-800">
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Ready to Build a Better Routine?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Take the next step on your journey. Explore our plans and unlock the tools you need to thrive.
          </p>
          <a href="/pricing" className="mt-8 inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            View Pricing & Plans
          </a>
        </div>
      </div>
    </div>
  );
}
