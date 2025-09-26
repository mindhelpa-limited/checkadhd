"use client";

import React, { useState } from 'react';
import { BookOpen, Calendar, DollarSign, Users, Zap, Briefcase, ChevronDown, ChevronUp, Star, Lightbulb, GraduationCap } from 'lucide-react';

// Curriculum data structured by week
const curriculumData = [
    {
        week: "Week 1: Foundational Pillars – The Coach’s Identity & Core Science",
        theme: "Laying the Ethical and Neurobiological Groundwork",
        modules: [
            { id: 1, title: "Module 1: The Mandate & Ethics of Coaching", content: "Defining the scope of a Mental Health Coach (vs. Therapist/Counsellor). Establishing strict ethical boundaries, confidentiality, and duty of care." },
            { id: 2, title: "Module 2: Core Mental Health Concepts (The Landscape)", content: "Understanding common conditions (Anxiety, Depression, Bipolar, " + '$\\text{ADHD}$' + ") and basic symptomology. Focusing on supportive, non-diagnostic language." },
            { id: 3, title: "Module 3: Neurobiology & The Brain (The Inner Sanctuary)", content: "Understanding the nervous system (ANS), the stress response (cortisol/adrenaline), and basic brain plasticity. Applying psychoeducation effectively." },
            { id: 4, title: "Module 4: Deep Listening & Rapport Building", content: "Mastering Level 3 (Deep) listening. Techniques for building immediate, unconditional positive regard and trust with diverse clients." },
            { id: 5, title: "Module 5: The Power of Motivational Interviewing (MI)", content: "Introduction to MI principles (OARS) to elicit change talk and resolve ambivalence. Moving clients from contemplation to action." },
        ],
    },
    {
        week: "Week 2: Diagnostic Rituals – Assessment & Proven Tools",
        theme: "Acquiring Structured Frameworks for Client Progress",
        modules: [
            { id: 6, title: "Module 6: CBT & DBT Basics for Coaches", content: "Practical application of Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT) skills (e.g., thought records, distress tolerance) within a coaching context." },
            { id: 7, title: "Module 7: Trauma-Informed Coaching Principles", content: "Recognizing signs of trauma (without diagnosing). Prioritizing safety, transparency, and collaboration to avoid re-traumatization." },
            { id: 8, title: "Module 8: Screening Tools & " + '$\\text{DSM-5}$' + " Context", content: "Using validated self-report screening tools (e.g., PHQ-9, GAD-7) and understanding when and how to refer a client for formal psychiatric diagnosis." },
            { id: 9, title: "Module 9: Goal Setting (SMART & Beyond)", content: "Mastering collaborative goal-setting techniques that are sustainable, aligned with client values, and adaptive to mental health challenges." },
            { id: 10, title: "Module 10: Psychoeducation Masterclass", content: "Developing scripts and resources to educate clients on topics like sleep hygiene, emotional regulation, and executive function." },
        ],
    },
    {
        week: "Week 3: Pastoral Care Techniques – Intervention & Practice",
        theme: "Hands-On Coaching, Specialization, and Deep Client Work",
        modules: [
            { id: 11, title: "Module 11: Crisis Management and Safety Planning", content: "Recognizing high-risk indicators (suicidality, self-harm). Implementing practical crisis plans and activating external emergency resources." },
            { id: 12, title: "Module 12: Group Coaching Dynamics & Facilitation", content: "Designing effective group sessions, managing challenging group members, and leveraging the power of peer support for exponential growth." },
            { id: 13, title: "Module 13: Coaching the " + '$\\text{ADHD}$' + " Client", content: "Specialized tools and strategies for executive function challenges, time blindness, and emotional dysregulation common in " + '$\\text{ADHD}$' + "." },
            { id: 14, title: "Module 14: Boundary Setting for Coach & Client", content: "Establishing firm professional and personal boundaries, managing client expectations, and addressing requests outside the scope of coaching." },
            { id: 15, title: "Module 15: Self-Care, Supervision & Burnout Prevention", content: "Mandatory curriculum on sustaining your career. Developing a robust supervision network and personalized self-care plan." },
        ],
    },
    {
        week: "Week 4: Seminary to Sanctuary – Business & Launch",
        theme: "Certified Business Models for a Thriving Coaching Practice",
        modules: [
            { id: 16, title: "Module 16: Legal, Insurance & Administrative Setup", content: "The non-negotiables: registering your business, professional liability insurance, " + '$\\text{GDPR}$' + "/data protection compliance, and basic bookkeeping." },
            { id: 17, title: "Module 17: Proven Pricing Models & Packaging", content: "Analysis of profitable coaching models (per-session, package, retainer). Strategies for communicating your value and handling fee resistance." },
            { id: 18, title: "Module 18: Client Acquisition: The Ethical Funnel", content: "Building a trust-based marketing system. Using content creation and professional networking to attract your ideal clients without hype." },
            { id: 19, title: "Module 19: Digital Presence & Telehealth Setup", content: "Optimizing your website/social media. Choosing secure, compliant telehealth platforms and setting up scheduling systems." },
            { id: 20, title: "Module 20: Final Project: The Practice Launch Plan", content: "Submitting a complete business plan, mock coaching session recording, and final ethics quiz to receive your MIMH Professional Coach Certification." },
        ],
    },
];

// Helper component for Accordion
const ModuleAccordion = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-700/50 last:border-b-0">
            <button
                className="flex justify-between items-center w-full py-4 px-6 text-left transition duration-200 hover:bg-blue-900/40"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-start space-x-4">
                    <span className="text-2xl font-black text-cyan-400 opacity-80 mt-[-2px]">{item.id}.</span>
                    <span className="text-white font-semibold flex-1 leading-snug">{item.title}</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-300 flex-shrink-0">
                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">{isOpen ? 'Minimize' : 'View Details'}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 pb-5 pt-3 text-gray-300 bg-blue-900/20 border-t border-gray-700/50 text-base leading-relaxed">
                    {item.content}
                </div>
            )}
        </div>
    );
};

// ----------------- New Animated Hero Component -----------------

/**
 * Animated Nebula/Glow Component
 * Renders a subtle, abstract glow effect for the hero background,
 * symbolizing knowledge and potential.
 */
const AnimatedNebula = () => (
    <div className="absolute inset-0 z-10 overflow-hidden">
        {/* Large, slow glowing sphere (Nebula core) */}
        <div 
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl opacity-50 animate-glow-slow"
            style={{ transform: 'translate(-50%, -50%)', animationDelay: '1s' }}
        ></div>
        {/* Second sphere for color depth */}
        <div 
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-700/10 rounded-full blur-3xl opacity-50 animate-glow-slow-reverse"
            style={{ transform: 'translate(-50%, -50%)', animationDelay: '0s' }}
        ></div>
    </div>
);


/**
 * Main component for the MIMH Pricing and Curriculum Page.
 */
export default function MindhelpaInstitutePricing() {
    const price = 1500;
    
    // Adjusted background color slightly darker blue for better contrast
    return (
        <div className="bg-[#020617] text-white min-h-screen pt-16 font-sans overflow-hidden">
            
            {/* HEADER/HERO SECTION */}
            <div className="relative py-24 sm:py-32 overflow-hidden">
                
                {/* ➡️ INTEGRATED Animated Background Component (z-10) */}
                <AnimatedNebula />
                
                {/* Text Content (z-20) */}
                <div className="relative z-20 max-w-6xl mx-auto text-center px-4 animate-hero-title-fade">
                    <p className="font-sans text-base font-semibold leading-7 text-cyan-400 uppercase tracking-widest flex justify-center items-center mb-3">
                        <GraduationCap className="w-6 h-6 mr-2 text-blue-400" />
                        PROFESSIONAL COACH CERTIFICATION
                    </p>
                    <h1 className="text-5xl sm:text-7xl font-extrabold font-serif text-white leading-tight drop-shadow-2xl">
                        Mindhelpa Institute of Mental Health
                    </h1>
                    <h2 className="text-xl sm:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200 mt-4 italic">
                        The Seminary for Professional Mental Health Coaches
                    </h2>
                    <p className="mt-8 max-w-4xl mx-auto text-lg text-gray-400">
                        {'An intensive, 4-week, $\\text{20-module}$ certification program designed to equip you with **deep clinical understanding, ethical mastery, and a proven, immediately deployable business model.**'}
                    </p>
                </div>
                {/* ⬅️ End Animated Background Component */}
            </div>
            
            {/* PRICING & CALL TO ACTION CARD */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20">
                
                {/* Price Card */}
                <div className="lg:col-span-1 p-8 rounded-3xl shadow-3xl bg-gradient-to-br from-blue-900 via-blue-900/80 to-blue-950 border-4 border-blue-600/50 h-fit lg:sticky lg:top-8 transform hover:scale-[1.02] transition duration-300 z-30">
                    <p className="text-sm uppercase tracking-widest font-bold text-blue-200 mb-2">Total Program Investment</p>
                    <div className="flex items-center justify-between border-b border-blue-600/50 pb-4 mb-6">
                        <h3 className="text-7xl font-black text-white drop-shadow-md">
                            £{price}
                        </h3>
                        <Star className="w-10 h-10 text-yellow-400 fill-yellow-400/30" />
                    </div>

                    <p className="text-sm font-light italic text-blue-200/80 mb-6">
                        One-time fee includes all modules, resources, and final certification process.
                    </p>

                    <ul className="space-y-4 text-base font-medium text-blue-100/90">
                        <li className="flex items-center space-x-3">
                            <Calendar className="w-6 h-6 text-cyan-300 flex-shrink-0" /> 
                            <span>{'**4 Weeks** of Intensive Training ($\\text{20 Modules}$)'}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Zap className="w-6 h-6 text-cyan-300 flex-shrink-0" /> 
                            <span>{'$\\text{100\\%}$ Self-Paced with Lifetime Access'}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Users className="w-6 h-6 text-cyan-300 flex-shrink-0" /> 
                            <span>{'4 x Weekly $\\text{90-min}$ Live Q\&A \& Mentorship'}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Briefcase className="w-6 h-6 text-cyan-300 flex-shrink-0" /> 
                            <span>{'Certified Business Model & $\\text{GDPR-Compliant}$ Launch Kit'}</span>
                        </li>
                    </ul>

                    <button
                        // Placeholder for actual checkout link
                        onClick={() => alert("Enrolling in MIMH: You will now be directed to the secure payment portal for £1,500.")}
                        className="mt-10 w-full glow-on-hover bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-gray-900 text-xl font-extrabold py-5 rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/40 uppercase tracking-wider"
                    >
                        Secure Your Spot $\rightarrow$
                    </button>
                    <p className="mt-4 text-center text-xs text-blue-300/70">
                        Limited spots available per cohort to ensure mentor quality.
                    </p>
                </div>

                {/* Curriculum Details */}
                <div className="lg:col-span-2 bg-blue-900/40 p-8 rounded-3xl border border-blue-700/50 shadow-inner shadow-blue-950/50 z-20">
                    <h3 className="text-4xl font-bold mb-8 border-b border-blue-700/50 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                        {'The $\\text{20-Module}$ Curriculum Breakdown'}
                    </h3>
                    
                    <div className="space-y-10">
                        {curriculumData.map((weekData, weekIndex) => (
                            <div key={weekIndex} className="bg-blue-900/60 rounded-xl overflow-hidden shadow-2xl border border-blue-700/50">
                                <div className="p-5 bg-blue-800/80 border-b border-blue-700/50">
                                    <h4 className="text-2xl font-bold text-white flex items-center space-x-3">
                                        <BookOpen className="w-7 h-7 text-cyan-300" />
                                        <span>{weekData.week}</span>
                                    </h4>
                                    <p className="text-sm font-light text-blue-300 mt-1 italic">{weekData.theme}</p>
                                </div>
                                
                                <div className="divide-y divide-blue-800/50">
                                    {weekData.modules.map((moduleItem) => (
                                        <ModuleAccordion key={moduleItem.id} item={moduleItem} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Business Certification Section - Moved to a dedicated box */}
                    <div className="mt-16 p-8 bg-cyan-900/30 rounded-3xl border-2 border-cyan-500/50 shadow-xl shadow-cyan-900/50">
                        <h4 className="text-3xl font-bold text-cyan-300 mb-5 flex items-center space-x-4">
                            <Lightbulb className="w-8 h-8" />
                            <span>Certified Business Launchpad</span>
                        </h4>
                        <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                            We don't just train practitioners; we train successful entrepreneurs. Module 16-20 ensure you launch with a **profitable, compliant, and ethical business** from day one.
                        </p>
                        <ul className="space-y-3 text-gray-300 pl-4 border-l-4 border-cyan-400/50">
                            <li>{'**The $\\text{5-Figure}$ Package Model:** A step-by-step guide to structuring and pricing high-value, high-impact coaching packages.'}</li>
                            <li>**Referral Network Blueprint:** Strategies for building symbiotic relationships with Psychiatrists and Therapists for sustainable client flow.</li>
                            <li>{'**Digital Coach Toolkit:** Access to templates for client contracts, intake forms, and $\\text{GDPR-compliant}$ note-taking systems.'}</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Animations (Global Styles) */}
            <style jsx global>{`
                .animate-hero-title-fade {
                    animation: hero-title-fade 1.5s ease-out forwards;
                }
                @keyframes hero-title-fade {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                /* Slow, gentle glow effect */
                .animate-glow-slow {
                    animation: glow-pulse 15s ease-in-out infinite alternate;
                }
                .animate-glow-slow-reverse {
                    animation: glow-pulse 15s ease-in-out infinite alternate-reverse;
                }
                @keyframes glow-pulse {
                    0% {
                        transform: translate(-50%, -50%) scale(1.0);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(-48%, -52%) scale(1.1);
                        opacity: 0.7;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.0);
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
}