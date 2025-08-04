// /src/app/dashboard/adhd-test/AdhdTestPage.jsx

"use client";

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
import styles from './assessment.module.css';
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
    const [step, setStep] = useState('form');
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState(() => new Array(questions.length).fill(null));
    const [userInfo, setUserInfo] = useState({ name: '', sex: '', dob: '' });
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [milestoneNotification, setMilestoneNotification] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [calculatedScore, setCalculatedScore] = useState(0);

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
        <div className={`${styles.adhdContainer} ${step === 'results' ? styles.fullWidth : ''}`}>
            {milestoneNotification && <div className={styles.milestoneNotification}>{milestoneNotification}</div>}
            
            {showResumeDialog && (
                <div className={styles.dialogOverlay} style={{display: 'flex'}}>
                    <div className={styles.dialogBox}>
                        <h3>Welcome Back!</h3>
                        <p>You have an unfinished assessment. Resume or start over?</p>
                        <div className={styles.dialogButtons}>
                            <button onClick={handleResume} className={styles.navButton}>Resume</button>
                            <button onClick={handleStartNew} className={styles.navButton} style={{backgroundColor: '#6b7280'}}>Start New</button>
                        </div>
                    </div>
                </div>
            )}

            {step === 'form' && (
                <div>
                    <div style={{textAlign:'center', fontSize:'50px'}}>🧠</div>
                    <h2>Personal Information</h2>
                    <p style={{textAlign:'center'}}>Please provide your details to personalize your report.</p>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} />
                    <label htmlFor="sex">Sex</label>
                    <select id="sex" value={userInfo.sex} onChange={(e) => setUserInfo({...userInfo, sex: e.target.value})}>
                        <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                    </select>
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" value={userInfo.dob} onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})} />
                    <div className={styles.infoBox}>🔐 Your personal information is used only to personalize your assessment report and is not stored on our servers.</div>
                    <button onClick={handleStart} className={styles.navButton}>Begin ADHD Assessment</button>
                </div>
            )}

            {step === 'quiz' && (
                <div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar} style={{ width: `${((current + 1) / questions.length) * 100}%` }}>
                            {Math.round(((current + 1) / questions.length) * 100)}%
                        </div>
                    </div>
                    <h3>Question {current + 1} of {questions.length}</h3>
                    <p style={{fontSize:'18px', fontWeight:600, textAlign:'center'}}>{questions[current]}</p>
                    <div className={styles.optionsContainer}>
                        {options.map((opt, idx) => (
                            <button key={idx} className={`${styles.optionBtn} ${answers[current] === idx ? styles.selected : ''}`} onClick={() => handleAnswer(idx)}>
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div className={styles.navControls}>
                        <button onClick={handleGoBack} className={styles.navButton} disabled={current === 0}>Back</button>
                        <div></div>
                    </div>
                </div>
            )}
            
            {step === 'results' && (
                <div>
                    <Report userInfo={userInfo} answers={answers} />
                    <div className={styles.resultActions}>
                        <button onClick={handleDownloadPDF} className={styles.navButton} disabled={isDownloading}>
                            {isDownloading ? '📄 Generating PDF...' : '📄 Download Detailed Report as PDF'}
                        </button>
                        <button onClick={handleStartNew} className={styles.navButton} style={{backgroundColor: '#6b7280', maxWidth: '320px', marginTop:'10px'}}>
                            🔄 Restart Assessment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}