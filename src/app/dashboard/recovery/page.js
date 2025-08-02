"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { marked } from "marked";

// --- Icon Components ---
const BrainIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-purple-500"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08.5.5 0 0 0-.8-.64A2.5 2.5 0 0 1 5.5 13V9.5A2.5 2.5 0 0 1 8 7V5.5A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08.5.5 0 0 1 .8-.64A2.5 2.5 0 0 0 18.5 13V9.5A2.5 2.5 0 0 0 16 7V5.5A2.5 2.5 0 0 0 14.5 2Z"/></svg>);
const BookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-sky-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>);
const HeartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-rose-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>);
const TargetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-amber-500"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);

// --- Loader Component ---
const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-700">{message}</p>
  </div>
);

// --- Interactive Content Modal ---
const GeneratedContentModal = ({ contentData, onClose, onComplete, isGenerating }) => {
    const [quizState, setQuizState] = useState({ currentQuestion: 0, score: 0, selectedAnswer: null, feedback: '' });
    const [activeMediaTab, setActiveMediaTab] = useState('audio');

    const handleAnswer = (option) => {
        if (quizState.selectedAnswer !== null) return;
        const correctAnswer = contentData.content.quiz[quizState.currentQuestion].correctAnswer;
        if (option === correctAnswer) {
            setQuizState(prev => ({ ...prev, selectedAnswer: option, feedback: 'Correct!', score: prev.score + 1 }));
        } else {
            setQuizState(prev => ({ ...prev, selectedAnswer: option, feedback: `Incorrect. The correct answer is: ${correctAnswer}` }));
        }
    };

    const nextQuestion = () => {
        if (quizState.currentQuestion < contentData.content.quiz.length - 1) {
            setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1, selectedAnswer: null, feedback: '' }));
        } else {
            setQuizState(prev => ({ ...prev, feedback: `Quiz complete! You scored ${prev.score} out of ${contentData.content.quiz.length}` }));
        }
    };

    // CORRECTED RENDER FUNCTION
    const renderContent = () => {
        if (contentData.type === 'Passage' && contentData.content?.passage) {
            const quiz = contentData.content.quiz[quizState.currentQuestion];
            return (
                <div className="prose max-w-none text-gray-800">
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
        // Ensure that we only try to render strings with marked()
        if (typeof contentData.content === 'string') {
            return <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: marked(contentData.content) }}></div>;
        }
        return <p className="text-gray-600">Content is loading or not available in the expected format.</p>;
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">{contentData.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {isGenerating.text ? (
                        <div className="flex flex-col justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-4 text-gray-600">Generating your activity...</p>
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
                                            isGenerating.audio ? <div className="text-center text-gray-500 p-4">Generating audio...</div> : contentData.audioUrl ? <audio controls autoPlay src={contentData.audioUrl} className="w-full"></audio> : <p className="text-center text-gray-500">Audio is preparing or unavailable.</p>
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
                    <button onClick={() => onComplete(contentData.type)} disabled={Object.values(isGenerating).some(v => v)} className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-300">
                        Mark as Complete
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Main Recovery Page Component ---
export default function RecoveryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyLog, setDailyLog] = useState({});
  const [generatedContent, setGeneratedContent] = useState({ type: null, content: null, title: "" });
  const [isGenerating, setIsGenerating] = useState({ text: false, audio: false });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { router.push("/login"); return; }
      setUser(currentUser);
      const userDocRef = doc(db, "users", currentUser.uid);
      const logDocRef = doc(db, `users/${currentUser.uid}/recoveryLog`, today);
      try {
        const [userDocSnap, logDocSnap] = await Promise.all([getDoc(userDocRef), getDoc(logDocSnap)]);
        if (userDocSnap.exists()) setUserData(userDocSnap.data());
        else setUserData({ email: currentUser.email, displayName: currentUser.displayName, streak: 0 });
        if (logDocSnap.exists()) setDailyLog(logDocSnap.data());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, today]);

  const handleGenerateContent = async (activityType) => {
    setIsGenerating({ text: true, audio: false });
    setGeneratedContent({ type: activityType, content: null, title: `Generating ${activityType}...` });

    try {
      const textResponse = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityType }),
      });
      if (!textResponse.ok) throw new Error('Failed to generate text content.');
      const { content, title } = await textResponse.json();
      setGeneratedContent(prev => ({ ...prev, content, title }));
      setIsGenerating(prev => ({ ...prev, text: false }));

      if (activityType === 'Meditation') {
        setIsGenerating(prev => ({...prev, audio: true}));
        fetch('/api/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: content }),
          }).then(res => res.json()).then(data => {
            const byteCharacters = atob(data.audioBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: 'audio/wav'});
            const audioUrl = URL.createObjectURL(blob);
            setGeneratedContent(prev => ({ ...prev, audioUrl }));
          }).finally(() => setIsGenerating(prev => ({...prev, audio: false})))
      }
    } catch (error) {
      setGeneratedContent({ type: activityType, content: `Sorry, an error occurred: ${error.message}`, title: "Generation Failed" });
      setIsGenerating({ text: false, audio: false });
    }
  };

  const handleStaticContent = (activityType) => {
      let content, title;
      switch(activityType) {
          case "Care Plan":
              title = "ADHD Care Plan";
              content = "### Your Daily Exercise Goal\n\nConsistency is key. Aim for at least **10-15 minutes** of moderate exercise today.\n\n**Examples:**\n- Brisk walking\n- Jogging\n- Cycling\n- A quick home workout video\n\n*Physical activity is proven to help improve focus and reduce impulsivity. Once you've completed your exercise for the day, mark this task as complete.*";
              break;
          case "Cognitive Care":
              title = "Cognitive Care Plan";
              content = "### Fuel Your Brain\n\nProper hydration and nutrition are essential for managing ADHD symptoms.\n\n**Today's Goals:**\n1.  **Drink Water:** Aim for at least 8 glasses of water throughout the day.\n2.  **Eat Fruit:** Incorporate at least one serving of fruit into your diet.\n\n*Track your intake and mark this task as complete once you've met your goals.*";
              break;
      }
      setGeneratedContent({ type: activityType, content, title });
  };

  const handleMarkAsComplete = async (activityType) => {
    const logDocRef = doc(db, `users/${user.uid}/recoveryLog`, today);
    const newLog = { ...dailyLog, [activityType]: true };
    await setDoc(logDocRef, newLog, { merge: true });
    setDailyLog(newLog);
    setGeneratedContent({ type: null, content: null, title: "" });
  };

  if (loading) {
    return <FullScreenLoader message="Loading Your Recovery Plan..." />;
  }

  const dailyTasks = [
      { id: "Meditation", name: "Targeted Meditation", icon: <BrainIcon />, description: "A 7-minute guided session to improve focus.", action: () => handleGenerateContent("Meditation") },
      { id: "Passage", name: "Passage of the Day", icon: <BookIcon />, description: "A short read and quiz about ADHD strategies.", action: () => handleGenerateContent("Passage") },
      { id: "Care Plan", name: "ADHD Care Plan", icon: <HeartIcon />, description: "Log your recommended daily exercises.", action: () => handleStaticContent("Care Plan") },
      { id: "Cognitive Care", name: "Cognitive Care Plan", icon: <HeartIcon />, description: "Track your water and fruit intake.", action: () => handleStaticContent("Cognitive Care") },
      { id: "Focus Exercise", name: "Focus Exercise", icon: <TargetIcon />, description: "A timed 7-minute focus-building activity.", action: () => handleGenerateContent("Focus Exercise") },
  ];

  return (
    <div className="pb-24 md:pb-0">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Daily Recovery Plan</h1>
            <div className="text-center">
                <p className="font-semibold text-lg">🔥 {userData?.streak || 0} Day Streak</p>
                <p className="text-sm text-gray-500">Complete all tasks to continue!</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyTasks.map(task => (
                <div key={task.id} className={`bg-white p-6 rounded-lg shadow-md transition-all ${dailyLog[task.id] ? 'bg-gray-50 opacity-60' : 'hover:shadow-lg'}`}>
                    <div className="flex items-center mb-4">
                        {task.icon}
                        <h2 className="text-xl font-bold text-gray-800">{task.name}</h2>
                    </div>
                    <p className="text-gray-600 mb-6 min-h-[3rem]">{task.description}</p>
                    <button onClick={task.action} disabled={dailyLog[task.id]} className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {dailyLog[task.id] ? <><CheckCircleIcon/> <span className="ml-2">Completed</span></> : "Start"}
                    </button>
                </div>
            ))}
        </div>
        {generatedContent.type && (
            <GeneratedContentModal 
                contentData={generatedContent}
                onClose={() => setGeneratedContent({ type: null, content: null, title: "" })}
                onComplete={handleMarkAsComplete}
                isGenerating={isGenerating}
            />
        )}
    </div>
  );
}
