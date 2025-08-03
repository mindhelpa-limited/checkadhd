"use client";
import { BrainCircuit, Heart, Lightbulb, Users } from "lucide-react";

// --- Value Card Component ---
const ValueCard = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 text-center">{title}</h3>
        <p className="mt-2 text-gray-600 text-center">{children}</p>
    </div>
);

// --- Job Opening Component ---
const JobOpening = ({ title, location, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow">
        <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-500 mt-1">{location} &middot; {type}</p>
        </div>
        <a href="#" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors">
            Apply
        </a>
    </div>
);


// --- Main Careers Page Component ---
export default function CareersPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* --- Hero Section --- */}
      <div className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2787&auto=format&fit=crop" 
                alt="A vibrant and collaborative team working together" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 px-4 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Join Our Mission
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            Help us build tools that empower minds and change lives. We're looking for passionate, talented people to join our team.
          </p>
        </div>
      </div>

      {/* --- Why Join Us Section --- */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Why You'll Love Working Here</h2>
                <p className="mt-4 text-lg text-gray-600">We're more than just a company; we're a community driven by a shared purpose.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ValueCard icon={<Heart size={32} />} title="Meaningful Work">
                    Create products that have a real, positive impact on people's lives every single day.
                </ValueCard>
                <ValueCard icon={<Users size={32} />} title="Collaborative Culture">
                    Join a supportive, inclusive team where every voice is heard and valued.
                </ValueCard>
                <ValueCard icon={<Lightbulb size={32} />} title="Innovation & Growth">
                    We encourage creative thinking and provide opportunities for professional development.
                </ValueCard>
                <ValueCard icon={<BrainCircuit size={32} />} title="Focus on Wellbeing">
                    We believe in a healthy work-life balance and support the wellbeing of our team.
                </ValueCard>
            </div>
        </div>
      </div>
      
      {/* --- Open Positions Section --- */}
      <div className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Open Positions</h2>
          <div className="space-y-6">
            <JobOpening title="Senior Frontend Engineer (React)" location="Remote" type="Full-time" />
            <JobOpening title="Product Designer (UI/UX)" location="Remote" type="Full-time" />
            <JobOpening title="Clinical Content Specialist" location="Remote" type="Part-time" />
            <div className="text-center pt-6">
                <p className="text-gray-600">Don't see your role? <a href="mailto:careers@adhdcheck.com" className="text-blue-600 font-semibold hover:underline">Send us your resume.</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Life at ADHD Check Section --- */}
      <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Life at ADHD Check</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="grid gap-4">
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop" alt="Team brainstorming session"/></div>
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2940&auto=format&fit=crop" alt="Team members smiling"/></div>
                  </div>
                  <div className="grid gap-4">
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3132&auto=format&fit=crop" alt="Colleagues collaborating on a project"/></div>
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1573496774439-fe3923b03646?q=80&w=2940&auto=format&fit=crop" alt="A person presenting ideas on a whiteboard"/></div>
                  </div>
                  <div className="grid gap-4">
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop" alt="Team social event"/></div>
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2940&auto=format&fit=crop" alt="A professional woman leading a meeting"/></div>
                  </div>
                  <div className="grid gap-4">
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop" alt="A modern and bright office space"/></div>
                      <div><img className="h-auto max-w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2940&auto=format&fit=crop" alt="A team celebrating a success"/></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
