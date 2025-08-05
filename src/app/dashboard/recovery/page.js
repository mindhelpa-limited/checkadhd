"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { marked } from "marked";
import { motion, AnimatePresence } from "framer-motion";

// --- Icon Components ---
const BrainIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-purple-500"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08.5.5 0 0 0-.8-.64A2.5 2.5 0 0 1 5.5 13V9.5A2.5 2.5 0 0 1 8 7V5.5A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08.5.5 0 0 1 .8-.64A2.5 2.5 0 0 0 18.5 13V9.5A2.5 2.5 0 0 0 16 7V5.5A2.5 2.5 0 0 0 14.5 2Z"/></svg>);
const BookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-sky-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>);
const HeartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-rose-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>);
const TargetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-amber-500"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);

// --- Loader Component ---
const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    <p className="mt-4 text-gray-700 font-semibold text-lg">{message}</p>
  </div>
);

// --- Interactive Content Modal ---
const GeneratedContentModal = ({ contentData, onClose, onComplete, isGenerating, userName }) => {
    const [quizState, setQuizState] = useState({ currentQuestion: 0, score: 0, selectedAnswer: null, feedback: '' });
    const [activeMediaTab, setActiveMediaTab] = useState('audio');
    const [timer, setTimer] = useState(0); 
    
    const hasFinishedGenerating = !Object.values(isGenerating).some(v => v);

    // Effect to handle the continuous timer countdown/count up
    useEffect(() => {
        let interval;
        if (!hasFinishedGenerating) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            setTimer(0);
        }

        return () => clearInterval(interval);
    }, [hasFinishedGenerating]);

    const handleAnswer = (option) => {
        if (quizState.selectedAnswer !== null) return;
        const quiz = contentData.content.quiz;
        if (!quiz || quiz.length <= quizState.currentQuestion) return;

        const correctAnswer = quiz[quizState.currentQuestion].correctAnswer;
        if (option === correctAnswer) {
            setQuizState(prev => ({ ...prev, selectedAnswer: option, feedback: 'Correct!', score: prev.score + 1 }));
        } else {
            setQuizState(prev => ({ ...prev, selectedAnswer: option, feedback: `Incorrect. The correct answer is: ${correctAnswer}` }));
        }
    };

    const nextQuestion = () => {
        if (!contentData.content.quiz) return;
        if (quizState.currentQuestion < contentData.content.quiz.length - 1) {
            setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1, selectedAnswer: null, feedback: '' }));
        } else {
            setQuizState(prev => ({ ...prev, feedback: `Quiz complete! You scored ${prev.score} out of ${contentData.content.quiz.length}` }));
        }
    };

    const renderContent = () => {
        if (!contentData.content) {
            return <p className="text-gray-600 text-center">Content not available. Please try again.</p>;
        }
        
        if (contentData.type === 'Passage' && contentData.content?.passage) {
            const quiz = contentData.content.quiz?.[quizState.currentQuestion];
            if (!quiz) {
                return <p className="text-gray-600 text-center">Quiz not available. Please try again.</p>;
            }
            return (
                <div className="prose max-w-none text-gray-800">
                    <p className="font-semibold text-lg">Hello, {userName}!</p>
                    <div dangerouslySetInnerHTML={{ __html: marked(contentData.content.passage) }}></div>
                    <hr className="my-6"/>
                    <h3 className="text-xl font-bold">Quiz Time!</h3>
                    <p className="font-semibold">{quiz.question}</p>
                    <div className="space-y-2 not-prose">
                        {quiz.options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswer(option)} disabled={quizState.selectedAnswer !== null}
                                className={`w-full text-left p-3 border rounded-lg transition-colors ${quizState.selectedAnswer === null ? 'hover:bg-gray-100' : ''} ${quizState.selectedAnswer === option && option === quiz.correctAnswer ? 'bg-green-100 border-green-500' : ''} ${quizState.selectedAnswer === option && option !== quiz.correctAnswer ? 'bg-red-100 border-red-500' : ''}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                    {quizState.feedback && (
                        <div className={`mt-4 p-3 rounded-lg ${quizState.feedback.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <p>{quizState.feedback}</p>
                            <button onClick={nextQuestion} className="mt-2 text-blue-600 font-semibold">
                                {quizState.currentQuestion < contentData.content.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </button>
                        </div>
                    )}
                </div>
            );
        }
        if (typeof contentData.content === 'string') {
            return (
                <div className="prose max-w-none text-gray-800">
                    <p className="font-semibold text-lg">Hello, {userName}!</p>
                    <div dangerouslySetInnerHTML={{ __html: marked(contentData.content) }}></div>
                </div>
            );
        }
        return <p className="text-gray-600 text-center">Content is loading or not available in the expected format.</p>;
    };

    return (
        <AnimatePresence>
            {contentData.type && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    >
                        <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                            <h2 className="text-xl font-bold text-gray-800">{contentData.title}</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        </header>
                        <main className="p-6 overflow-y-auto relative">
                            {contentData.imageUrl && hasFinishedGenerating ? (
                                <img src={contentData.imageUrl} alt="Generated visual" className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm" />
                            ) : null}
                            {!hasFinishedGenerating ? (
                                <div className="flex flex-col justify-center items-center h-48">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    <p className="mt-4 text-gray-600 text-center">
                                        {isGenerating.image ? `Creating a visual for you...` : isGenerating.audio ? `Creating the audio file...` : `Generating your activity...`}
                                        {` (${timer}s)`}
                                    </p>
                                    <AnimatePresence>
                                        {userName && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="mt-4 p-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-md"
                                            >
                                                Hello {userName}, the wait is almost over!
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <>
                                    {contentData.type === 'Meditation' && (
                                        <div>
                                            <div className="flex border-b mb-4">
                                                <button onClick={() => setActiveMediaTab('audio')} className={`px-4 py-2 font-semibold text-sm ${activeMediaTab === 'audio' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Audio</button>
                                                <button onClick={() => setActiveMediaTab('text')} className={`px-4 py-2 font-semibold text-sm ${activeMediaTab === 'text' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Text</button>
                                            </div>
                                            <div>
                                                {activeMediaTab === 'audio' && (
                                                    contentData.audioUrl ? <audio controls autoPlay src={contentData.audioUrl} className="w-full"></audio> : <p className="text-center text-gray-500">Audio is preparing or unavailable.</p>
                                                )}
                                                {activeMediaTab === 'text' && renderContent()}
                                            </div>
                                        </div>
                                    )}
                                    {contentData.type !== 'Meditation' && renderContent()}
                                </>
                            )}
                        </main>
                        <footer className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
                            <button onClick={() => onComplete(contentData.type)} disabled={!hasFinishedGenerating} className="w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300">
                                <CheckCircleIcon/> Mark as Complete
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Main Recovery Page Component ---
export default function RecoveryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyLog, setDailyLog] = useState({});
  const [generatedContent, setGeneratedContent] = useState({ type: null, content: null, title: "", imageUrl: null });
  const [isGenerating, setIsGenerating] = useState({ text: false, audio: false, image: false });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { router.push("/login"); return; }
      setUser(currentUser);
      const userDocRef = doc(db, "users", currentUser.uid);
      const logDocRef = doc(db, `users/${currentUser.uid}/recoveryLog`, today);
      try {
        const [userDocSnap, logDocSnap] = await Promise.all([getDoc(userDocRef), getDoc(logDocRef)]);
        if (userDocSnap.exists()) setUserData(userDocSnap.data());
        else setUserData({ email: currentUser.email, displayName: currentUser.displayName, streak: 0, score: 0 }); 
        if (logDocSnap.exists()) setDailyLog(logDocSnap.data());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, today]);
  
  const dailyTasks = [
      { id: "Meditation", name: "Targeted Meditation", icon: <BrainIcon />, description: "A guided session to improve focus and inner calm.", action: () => handleGenerateContent("Meditation") },
      { id: "Passage", name: "ADHD Strategies", icon: <BookIcon />, description: "A short read and quiz on a new coping mechanism.", action: () => handleGenerateContent("Passage") },
      { id: "Care Plan", name: "Daily Exercise", icon: <HeartIcon />, description: "Log your recommended daily physical activity.", action: () => handleStaticContent("Care Plan") },
      { id: "Cognitive Care", name: "Brain Fuel", icon: <HeartIcon />, description: "Track your water and healthy food intake.", action: () => handleStaticContent("Cognitive Care") },
      { id: "Focus Exercise", name: "Focus Challenge", icon: <TargetIcon />, description: "A simple, timed activity to build concentration.", action: () => handleGenerateContent("Focus Exercise") },
  ];

  const handleGenerateContent = async (activityType) => {
    setIsGenerating({ text: true, audio: activityType === 'Meditation', image: true });
    setGeneratedContent({ type: activityType, content: null, title: `Generating your ${activityType.toLowerCase()}...`, imageUrl: null });
    const score = userData?.score || 0;

    try {
      const textPromise = fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityType, score }),
      }).then(res => res.json());

      const imagePromise = fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: getCatchyImagePrompt(activityType) }),
      }).then(res => res.json());

      const [textData, imageData] = await Promise.all([textPromise, imagePromise]);

      if (textData.error) throw new Error(textData.error);
      if (imageData.error) throw new Error(imageData.error);

      setGeneratedContent(prev => ({ ...prev, content: textData.content, title: textData.title, imageUrl: imageData.imageUrl }));
      setIsGenerating(prev => ({ ...prev, text: false, image: false }));

      if (activityType === 'Meditation') {
        // Adjust the speed for a more natural pace
        const audioResponse = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textData.content, speed: 0.95 }),
        });
        if (!audioResponse.ok) throw new Error('Failed to generate audio.');
        const audioData = await audioResponse.json();
        setGeneratedContent(prev => ({ ...prev, audioUrl: audioData.audioUrl }));
        setIsGenerating(prev => ({ ...prev, audio: false }));
      }

    } catch (error) {
      console.error("API Error:", error);
      setGeneratedContent({ 
        type: activityType, 
        content: `Sorry, an error occurred while generating your content. Please try again.`, 
        title: "Generation Failed", 
        imageUrl: null 
      });
      setIsGenerating({ text: false, audio: false, image: false });
    }
  };
  
  // Helper function to get image prompt
  const getCatchyImagePrompt = (activityType) => {
    switch (activityType) {
        case 'Meditation': return "A serene, minimalist illustration of a calm lake at dawn, representing mental clarity and focus. The colors are soft and muted, evoking peace.";
        case 'Passage': return "An abstract digital illustration of a brain with orderly connections, where chaotic lines become a structured network, symbolizing focus and organization.";
        case 'Focus Exercise': return "A close-up photograph of a single, intricate object, like a beautiful leaf with dew drops or a complex mechanical watch, symbolizing detailed observation and concentration.";
        default: return "An uplifting, abstract image with vibrant colors representing personal growth and recovery.";
    }
  };

  const handleStaticContent = (activityType) => {
      let content, title, imageUrl;
      switch(activityType) {
          case "Care Plan":
              title = "ADHD Care Plan";
              content = "### Your Daily Exercise Goal\n\nConsistency is key. Aim for at least **10-15 minutes** of moderate exercise today.\n\n**Examples:**\n- Brisk walking\n- Jogging\n- Cycling\n- A quick home workout video\n\n*Physical activity is proven to help improve focus and reduce impulsivity. Once you've completed your exercise for the day, mark this task as complete.*";
              imageUrl = "https://images.unsplash.com/photo-1549476778-d510f22f7188";
              break;
          case "Cognitive Care":
              title = "Cognitive Care Plan";
              content = "### Fuel Your Brain\n\nProper hydration and nutrition are essential for managing ADHD symptoms.\n\n**Today's Goals:**\n1.  **Drink Water:** Aim for at least 8 glasses of water throughout the day.\n2.  **Eat Fruit:** Incorporate at least one serving of fruit into your diet.\n\n*Track your intake and mark this task as complete once you've met your goals.*";
              imageUrl = "https://images.unsplash.com/photo-1534063546736-24a61358a946";
              break;
      }
      setGeneratedContent({ type: activityType, content, title, imageUrl });
  };

  const handleMarkAsComplete = async (activityType) => {
    const logDocRef = doc(db, `users/${user.uid}/recoveryLog`, today);
    const newLog = { ...dailyLog, [activityType]: true };

    await setDoc(logDocRef, newLog, { merge: true });
    setDailyLog(newLog);
    setGeneratedContent({ type: null, content: null, title: "", imageUrl: null });

    // New logic to check for streak completion
    const allTasksCompleted = dailyTasks.every(task => newLog[task.id]);

    if (allTasksCompleted) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const currentStreak = userDocSnap.data()?.streak || 0;
        const newStreak = currentStreak + 1;

        await setDoc(userDocRef, { streak: newStreak, lastCompletedDate: today }, { merge: true });
        setUserData(prev => ({ ...prev, streak: newStreak }));
    }
  };

  if (loading) {
    return <FullScreenLoader message="Loading Your Recovery Plan..." />;
  }
  
  const userName = userData?.displayName?.split(' ')[0] || "there";

  return (
    <div className="pb-24 md:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Daily Recovery Plan</h1>
            <div className="text-center mt-4 sm:mt-0">
                <p className="font-semibold text-lg">🔥 {userData?.streak || 0} Day Streak</p>
                <p className="text-sm text-gray-500">Complete all tasks to continue!</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyTasks.map(task => (
                <motion.div 
                    key={task.id} 
                    className={`bg-white p-6 rounded-lg shadow-md transition-all ${dailyLog[task.id] ? 'bg-gray-50 opacity-60' : 'hover:shadow-lg'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center mb-4 space-x-3">
                        {task.icon}
                        <h2 className="text-xl font-bold text-gray-800">{task.name}</h2>
                    </div>
                    <p className="text-gray-600 mb-6 min-h-[3rem]">{task.description}</p>
                    <button onClick={task.action} disabled={dailyLog[task.id]} className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {dailyLog[task.id] ? <><CheckCircleIcon/> <span className="ml-2">Completed</span></> : "Start"}
                    </button>
                </motion.div>
            ))}
        </div>
        <AnimatePresence>
          {generatedContent.type && (
              <GeneratedContentModal 
                  contentData={generatedContent}
                  onClose={() => setGeneratedContent({ type: null, content: null, title: "", imageUrl: null })}
                  onComplete={handleMarkAsComplete}
                  isGenerating={isGenerating}
                  userName={userName}
              />
          )}
        </AnimatePresence>
    </div>
  );
}