import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
import Report from './Report';
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

// --- Data Constants: Full set of 73 questions for your assessment ---
const questions = [
  'Do you often have difficulty sustaining attention in tasks or play activities?',
  'Do you frequently make careless mistakes in schoolwork, work, or or other activities?',
  'Do you often not seem to listen when spoken to directly?',
  'Do you often fail to follow through on instructions and finish schoolwork, chores, or duties in the workplace?',
  'Do you often have difficulty organizing tasks and activities?',
  'Do you often avoid, dislike, or are reluctant to engage in tasks that require sustained mental effort?',
  'Do you often lose things necessary for tasks or activities?',
  'Are you often easily distracted by external stimuli?',
  'Are you often forgetful in daily activities?',
  'Do you often fidget with or tap your hands or feet, or squirm in your seat?',
  'Do you often leave your seat in situations when remaining seated is expected?',
  'Do you often run or climb in situations where it is inappropriate?',
  'Are you often unable to play or engage in leisure activities quietly?',
  'Are you often "on the go," acting as if driven by a motor?',
  'Do you often talk excessively?',
  'Do you often blurt out answers before questions have been completed?',
  'Do you often have difficulty waiting your turn?',
  'Do you often interrupt or intrude on others?',
  'Do you have trouble staying focused during conversations?',
  'Are you easily distracted by your own thoughts or daydreams?',
  'Do you find it difficult to complete tasks that have multiple steps?',
  'Do you misplace personal items like keys, wallet, or phone frequently?',
  'Is it hard for you to prioritize what needs to be done?',
  'Do you often get bored with a task after only a few minutes?',
  'Do you feel a need to move around or fidget, even when you are supposed to be still?',
  'Do you find yourself interrupting people or finishing their sentences?',
  'Do you often act on impulse without thinking about the consequences?',
  'Is it difficult for you to wait in line or for your turn?',
  'Do you have trouble paying attention to details?',
  'Do you often seem to be "spacing out" during class or meetings?',
  'Is it hard for you to follow through on promises or commitments?',
  'Do you tend to be messy or disorganized?',
  'Do you find it hard to stick with a project once the initial excitement has worn off?',
  'Do you feel restless or on edge most of the time?',
  'Is it hard for you to listen to a full movie or show without getting distracted?',
  'Do you often lose track of time?',
  'Do you have a hard time managing your emotions?',
  'Do you tend to act impulsively in social situations?',
  'Is it hard for you to control your temper?',
  'Do you feel overwhelmed by too many tasks at once?',
  'Do you struggle with remembering appointments or deadlines?',
  'Do you often start new projects before finishing old ones?',
  'Do you have trouble staying motivated for long-term goals?',
  'Do you often feel like you have a "short fuse"?',
  'Do you have a tendency to take risks without thinking?',
  'Is it hard for you to keep your personal space tidy?',
  'Do you often speak without thinking?',
  'Is it difficult for you to sit still for an extended period, like on a plane or in a long meeting?',
  'Do you often feel restless when you are supposed to be relaxing?',
  'Do you have trouble getting started on tasks you know you need to do?',
  'Do you often forget what you were just about to say?',
  'Do you struggle with managing your time effectively?',
  'Do you often feel like you are always rushing?',
  'Do you have difficulty following a schedule?',
  'Do you find it hard to organize your thoughts before speaking?',
  'Do you often find yourself doing several things at once without completing any of them?',
  'Do you have trouble staying on topic in a conversation?',
  'Do you often fidget with objects, such as a pen or a paper clip?',
  'Do you often get distracted by background noise?',
  'Do you feel a need for constant stimulation?',
  'Is it difficult for you to complete a book from start to finish?',
  'Do you often forget important dates?',
  'Do you find it hard to resist the urge to buy things on impulse?',
  'Do you often feel bored easily?',
  'Is it hard for you to keep your belongings in order?',
  'Do you often feel overwhelmed by details?',
  'Do you have difficulty working quietly?',
  'Do you often feel the need to move or tap your foot while seated?',
  'Is it hard for you to stay focused on a task that is not interesting?',
  'Do you often have difficulty waiting for your turn in group activities?',
  'Do you find it hard to manage your finances or pay bills on time?',
  'Do you frequently lose your train of thought?',
  'Do you have a hard time completing tasks that are difficult or tedious?',
];
const options = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];
const milestoneMessages = ["Keep Going!", "Great Focus!", "You're Doing Great!", "Excellent Progress!", "Fantastic Effort!"];


export default function AdhdTestPage() {
    const [step, setStep] = useState('disclaimer');
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState(() => new Array(questions.length).fill(null));
    const [userInfo, setUserInfo] = useState({ name: '', sex: '', dob: '' });
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [milestoneNotification, setMilestoneNotification] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [calculatedScore, setCalculatedScore] = useState(0);

    const audioRef = useRef(null);

    // Function to play the click sound
    const playClickSound = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Rewind to the start
        audioRef.current.play();
      }
    };

    useEffect(() => {
        const savedStateJSON = localStorage.getItem('adhdAssessmentState');
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState && savedState.current < questions.length && savedState.current > 0) {
                setUserInfo(savedState.userInfo);
                setShowResumeDialog(true);
            }
        }
    }, []);

    useEffect(() => {
        if (step === 'quiz') {
            const state = { current, answers, userInfo };
            localStorage.setItem('adhdAssessmentState', JSON.stringify(state));
        }
    }, [current, answers, userInfo, step]);

    const saveResultsToFirestore = async (score) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, {
                    score: score,
                    lastTest: serverTimestamp()
                });
                console.log("✅ Test results saved successfully!");
            } catch (error) {
                console.error("❌ Error saving test results:", error);
            }
        }
    };

    const handleStart = () => {
        if (!userInfo.name || !userInfo.sex || !userInfo.dob) {
            alert('Please complete all fields.');
            return;
        }
        setAnswers(new Array(questions.length).fill(null));
        setCurrent(0);
        setStep('quiz');
        localStorage.removeItem('adhdAssessmentState');
    };
    
    const handleAnswer = (answerIndex) => {
        playClickSound(); // Play the sound on option click
        
        const newAnswers = [...answers];
        newAnswers[current] = answerIndex;
        setAnswers(newAnswers);

        if ((current + 1) % 5 === 0 && current < questions.length - 1) {
            const message = milestoneMessages[Math.floor(Math.random() * milestoneMessages.length)];
            setMilestoneNotification(`🎉 ${message} 🎉`);
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, zIndex: 10001 });
            setTimeout(() => setMilestoneNotification(''), 3500);
        }

        setTimeout(() => {
            if (current < questions.length - 1) {
                setCurrent(current + 1);
            } else {
                const totalScore = newAnswers.reduce((sum, val) => sum + val, 0);
                setCalculatedScore(totalScore);
                saveResultsToFirestore(totalScore);
                setStep('results');
                localStorage.removeItem('adhdAssessmentState');
                confetti({ particleCount: 250, spread: 160, origin: { y: 0.3 }, zIndex: 10001 });
            }
        }, 300);
    };

    const handleGoBack = () => {
        if (current > 0) {
            playClickSound(); // Play the sound on back button click
            setCurrent(current - 1);
        }
    };
    
    const handleResume = () => {
        const savedState = JSON.parse(localStorage.getItem('adhdAssessmentState'));
        setUserInfo(savedState.userInfo);
        setAnswers(savedState.answers);
        setCurrent(savedState.current);
        setStep('quiz');
        setShowResumeDialog(false);
    };

    const handleStartNew = () => {
        localStorage.removeItem('adhdAssessmentState');
        setShowResumeDialog(false);
        setUserInfo({ name: '', sex: '', dob: '' });
        setStep('form');
    };
    
    const handleDownloadPDF = () => {
        setIsDownloading(true);
        setTimeout(() => {
            const element = document.getElementById('report-content');
            const options = {
                margin: [10, 10, 10, 10],
                filename: `ADHD_Assessment_Report_${userInfo.name.replace(/\s/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(element).set(options).save().finally(() => {
                setIsDownloading(false);
            });
        }, 500);
    };

    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#0A0A0A] text-gray-200">
        
        {/* Audio element for the click sound */}
        <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

        {/* Animated background glow effect for a premium feel */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-delay" />
        </div>

        {milestoneNotification && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10001] bg-teal-500/80 backdrop-blur-sm text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-lg font-bold shadow-lg rounded-full animate-fade-in">
            {milestoneNotification}
          </div>
        )}
        
        {showResumeDialog && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A] bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] max-w-sm w-full animate-fade-in text-center">
              <h3 className="text-3xl font-bold text-white mb-2">Welcome Back!</h3>
              <p className="text-gray-400 mb-6">You have an unfinished assessment. Resume or start over?</p>
              <div className="flex flex-col space-y-4">
                <button onClick={handleResume} className="px-8 py-3 font-semibold text-white rounded-2xl bg-teal-500 hover:bg-teal-600 transition-colors">Resume</button>
                <button onClick={handleStartNew} className="px-8 py-3 font-semibold text-white rounded-2xl bg-gray-600 hover:bg-gray-700 transition-colors">Start New</button>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-3xl">
          {step === 'disclaimer' && (
            <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-[#2c2c2c] text-center animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">A Quick Note on Accuracy</h2>
              <div className="p-6 md:p-8 bg-gray-900/50 rounded-2xl border border-gray-700 mb-8">
                <p className="text-gray-400 text-lg leading-relaxed">
                  You can only take this **ADHD test once every two weeks**.
                  This helps ensure that your results are **accurate and meaningful**,
                  reflecting a consistent period of time rather than a single moment.
                </p>
              </div>
              <button onClick={() => setStep('form')} className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-teal-500 hover:bg-teal-600 transition-colors">
                Let's Begin
              </button>
            </div>
          )}

          {step === 'form' && (
            <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-[#2c2c2c] animate-fade-in">
              <div className="text-center text-5xl mb-4">🧠</div>
              <h2 className="text-3xl font-bold text-white text-center mb-2">Personal Information</h2>
              <p className="text-gray-400 text-center mb-8">Please provide your details to personalize your report.</p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-400 font-semibold mb-2">Full Name</label>
                  <input type="text" id="name" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    placeholder="Enter your full name" />
                </div>
                <div>
                  <label htmlFor="sex" className="block text-gray-400 font-semibold mb-2">Sex</label>
                  <select id="sex" value={userInfo.sex} onChange={(e) => setUserInfo({...userInfo, sex: e.target.value})}
                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors">
                    <option value="" className="bg-gray-900">Select</option>
                    <option value="Male" className="bg-gray-900">Male</option>
                    <option value="Female" className="bg-gray-900">Female</option>
                    <option value="Other" className="bg-gray-900">Other</option>
                    <option value="Prefer not to say" className="bg-gray-900">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dob" className="block text-gray-400 font-semibold mb-2">Date of Birth</label>
                  <input type="date" id="dob" value={userInfo.dob} onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})}
                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-md p-4 rounded-xl mt-8 text-sm text-center text-gray-500">
                🔐 Your personal information is used only to personalize your assessment report and is not stored on our servers.
              </div>
              <button onClick={handleStart} className="mt-8 w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-teal-500 hover:bg-teal-600 transition-colors">
                Begin ADHD Assessment
              </button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-[#2c2c2c] animate-fade-in">
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-teal-500 rounded-full flex items-center justify-end pr-4 transition-all duration-500 ease-out" 
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                >
                  <span className="text-white text-sm font-semibold">
                    {Math.round(((current + 1) / questions.length) * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-center mb-6">
                Question {current + 1} of {questions.length}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">{questions[current]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt, idx) => (
                  <button key={idx} 
                    className={`py-4 px-6 text-lg font-semibold rounded-2xl transition-all duration-200
                      ${answers[current] === idx ? 'bg-teal-500 text-white shadow-lg' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'}`} 
                    onClick={() => handleAnswer(idx)}>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-start">
                <button onClick={handleGoBack} disabled={current === 0} 
                  className={`px-6 py-3 font-semibold rounded-2xl transition-colors
                  ${current === 0 ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}>
                  Back
                </button>
              </div>
            </div>
          )}
          
          {step === 'results' && (
            <div>
              <Report userInfo={userInfo} answers={answers} />
              <div className="mt-8 flex flex-col items-center">
                <button onClick={handleDownloadPDF} disabled={isDownloading} 
                  className="w-full max-w-xs px-8 py-4 font-semibold text-white rounded-2xl bg-teal-500 hover:bg-teal-600 transition-colors">
                  {isDownloading ? '📄 Generating PDF...' : '📄 Download Detailed Report as PDF'}
                </button>
                <button onClick={handleStartNew} 
                  className="mt-4 w-full max-w-xs px-8 py-4 font-semibold text-white rounded-2xl bg-gray-600 hover:bg-gray-700 transition-colors">
                  🔄 Restart Assessment
                </button>
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }

          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
  
          @keyframes blob-delay {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(-30px, 50px) scale(1.1);
            }
            66% {
              transform: translate(20px, -20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          
          .animate-blob {
            animation: blob 10s infinite ease-in-out;
          }
          .animate-blob-delay {
            animation: blob-delay 10s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
}