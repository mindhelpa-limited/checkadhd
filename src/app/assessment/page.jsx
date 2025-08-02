"use client";
import { useState } from "react";
import Footer from "../../components/home/Footer";
import { useRouter } from "next/navigation";

import confetti from 'canvas-confetti';
import { CheckCircle, Zap } from "lucide-react";

// --- A snippet of the full questions for the free preview ---
const snippetQuestions = [
    'Do you often have difficulty sustaining attention in tasks or play activities?', 
    'Do you frequently make careless mistakes in schoolwork, work, or other activities?', 
    'Do you find it hard to listen when spoken to directly?', 
    'Do you often fail to follow through on instructions and fail to finish schoolwork, chores, or duties?', 
    'Do you have trouble organizing tasks and activities?', 
    'Do you avoid or dislike tasks that require sustained mental effort?', 
    'Do you frequently lose things necessary for tasks and activities?'
];
const options = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];

// --- Main Assessment Page Component ---
export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState('intro'); // intro, quiz, paywall
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleStartSnippet = () => {
    setCurrentQuestion(0);
    setStep('quiz');
  };

  const handleAnswer = () => {
    setTimeout(() => {
      if (currentQuestion < snippetQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Finished the snippet, show the paywall
        setStep('paywall');
        confetti({ particleCount: 150, spread: 120, origin: { y: 0.6 } });
      }
    }, 300);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
              <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop" 
                  alt="Calm, serene background" 
                  className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent"></div>
          </div>

          <div className="w-full max-w-3xl bg-white bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 transition-all duration-500 z-10">
              
              {/* --- INTRO STEP --- */}
              {step === 'intro' && (
                  <div className="text-center animate-fadeIn">
                      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Understand Your Mind</h1>
                      <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                          Our assessment is built upon established clinical frameworks, including the Adult ADHD Self-Report Scale (ASRS) and DSM-5 criteria, to provide you with a comprehensive and insightful look into your cognitive patterns.
                      </p>
                      <ul className="mt-8 text-left inline-block space-y-3">
                          <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Clinically-Informed Questions</li>
                          <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Detailed, Personalized Results</li>
                          <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Foundation for Your Recovery Plan</li>
                      </ul>
                      <button onClick={handleStartSnippet} className="mt-10 w-full md:w-auto bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
                          Take a Free Snippet
                      </button>
                  </div>
              )}

              {/* --- QUIZ STEP --- */}
              {step === 'quiz' && (
                  <div className="animate-fadeIn">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / snippetQuestions.length) * 100}%` }}></div>
                      </div>
                      <p className="text-center text-gray-600 mb-4 font-medium">Question {currentQuestion + 1} of {snippetQuestions.length}</p>
                      <h2 className="text-2xl text-center font-bold text-gray-900 mb-8 min-h-[6rem]">{snippetQuestions[currentQuestion]}</h2>
                      <div className="space-y-3">
                          {options.map((option, index) => (
                              <button key={index} onClick={handleAnswer} className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-gray-800 font-medium hover:bg-blue-100 hover:border-blue-500 transition-colors">
                              {option}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* --- PAYWALL STEP --- */}
              {step === 'paywall' && (
                  <div className="text-center animate-fadeIn">
                      <div className="flex justify-center items-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
                          <Zap className="w-8 h-8 text-green-600" />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900">You're Doing Great!</h1>
                      <p className="mt-4 text-gray-600 text-lg">You've completed the first step. To unlock the full 75-question assessment and receive your detailed, personalized report, please subscribe to our premium plan.</p>
                      <button onClick={() => router.push('/pricing')} className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
                          Unlock Full Assessment
                      </button>
                       <button onClick={() => setStep('intro')} className="mt-4 w-full text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          Maybe Later
                      </button>
                  </div>
              )}
          </div>
      </div>
      <Footer />
    </>
  );
}
