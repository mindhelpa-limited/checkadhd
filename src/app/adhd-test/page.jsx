"use client";

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
import styles from './assessment.module.css';
import Report from './Report';

const questions = [
    'Do you often have difficulty sustaining attention in tasks or play activities?', 'Do you frequently make careless mistakes in schoolwork, work, or other activities?', 'Do you find it hard to listen when spoken to directly?', 'Do you often fail to follow through on instructions and fail to finish schoolwork, chores, or duties?', 'Do you have trouble organizing tasks and activities?', 'Do you avoid or dislike tasks that require sustained mental effort?', 'Do you frequently lose things necessary for tasks and activities (e.g., keys, books, tools)?', 'Are you easily distracted by extraneous stimuli?', 'Do you forget daily activities (e.g., doing chores, running errands)?', 'Do you fidget with or tap your hands or feet or squirm in your seat?', 'Do you often leave your seat in situations where remaining seated is expected?', 'Do you run about or climb in situations where it is inappropriate?', 'Are you often unable to play or engage in leisure activities quietly?', "Do you feel as if you are 'on the go' or driven by a motor?", 'Do you talk excessively?', 'Do you blurt out answers before questions have been completed?', 'Do you have difficulty waiting your turn?', 'Do you interrupt or intrude on others (e.g., butting into conversations or games)?', 'Do you often act without thinking?', 'Do you have difficulty delaying gratification?', 'Do you experience mood swings or emotional outbursts?', 'Do you often feel restless or unable to relax?', 'Do you make impulsive decisions that you later regret?', 'Do you struggle to maintain attention in conversations?', 'Do you find it hard to prioritize tasks?', 'Do you frequently shift from one uncompleted activity to another?', 'Do you feel overwhelmed by details and deadlines?', 'Do you frequently misplace your belongings (wallet, phone, etc.)?', 'Do you need reminders to complete everyday tasks?', 'Do you often forget appointments or obligations?', 'Do you feel your thoughts are racing or scattered?', 'Do you have difficulty planning ahead?', 'Do you find yourself procrastinating frequently?', 'Do you have difficulty managing time effectively?', 'Do you feel overwhelmed by long or complex tasks?', 'Do you have a low tolerance for frustration?', 'Do you become bored easily and crave new stimulation?', 'Do you experience frequent daydreaming?', 'Do you find repetitive tasks particularly difficult to stay focused on?', 'Do you frequently interrupt others even when you try not to?', 'Do you tend to zone out during conversations?', 'Do you frequently talk over people without realizing it?', 'Do you find it difficult to relax even when you want to?', 'Do you act impulsively in social situations?', 'Do you feel mentally fatigued from trying to focus all day?', 'Do you find noise or activity in the environment overly distracting?', 'Do you experience difficulty completing reading or written tasks?', 'Do you find your mind frequently jumps from topic to topic?', 'Do you feel your performance suffers under pressure due to attention lapses?', 'Do you struggle to follow multi-step instructions?', "Do you struggle to complete tasks unless there's a sense of urgency?", 'Do you find it difficult to follow through on hobbies or projects?', 'Do you feel anxious due to unfinished responsibilities?', 'Do you spend excessive time organizing but not starting tasks?', 'Do you overcommit to tasks and underestimate the time needed?', 'Do you frequently shift topics when talking or writing?', 'Do you rely on others to remind you of important tasks or events?', 'Do you forget why you entered a room or opened a browser tab?', 'Do you feel impatient when required to sit still for long?', 'Do you feel uncomfortable during long conversations or meetings?', 'Do you lose track of what you’re doing mid-task?', 'Do you find starting tasks to be mentally exhausting?', 'Do you impulsively spend money or commit to activities?', 'Do you feel disorganized at home or work?', 'Do you frequently forget to respond to messages or emails?', 'Do you struggle with perfectionism and still miss deadlines?', 'Do you feel embarrassed by your forgetfulness?', 'Do you experience mental clutter or racing thoughts regularly?', 'Do you find that small tasks take much longer than expected?', 'Do you feel mentally drained from trying to stay on track all day?', "Do you frequently feel like you're behind on everything?", 'Do you wish you had better control over your impulses and focus?'
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
        const reportElement = document.getElementById('report-content');
        if (!reportElement) {
            console.error("Report element not found!");
            return;
        }
        setIsDownloading(true);
        const cssString = `
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #1f2937; background-color: #ffffff; }
            strong { font-weight: bold !important; }
            .page { padding: 18mm 20mm; box-sizing: border-box; }
            .on-screen-report-wrapper { padding: 0 !important; border: none !important; box-shadow: none !important; }
            .pdf-header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2563eb; }
            .logo-container-pdf { display: flex; align-items: center; justify-content: center; margin-bottom: 5px; }
            .logo-image-pdf { width: 50px; height: 50px; margin-right: 12px; } 
            .main-report-title-pdf { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0; line-height: 1; } 
            .subtitle-report-pdf { text-align: center; color: #2563eb; font-size: 16px; margin: 5px 0 15px 0; font-weight: 600; }
            .patient-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
            .info-item { display: flex; flex-direction: column; }
            .info-label { font-size: 12px; color: #6b7280; font-weight: 500; margin-bottom: 2px; }
            .info-value { font-size: 14px; color: #1f2937; font-weight: 600; }
            .results-container { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .results-title { font-size: 18px; color: #111827; margin: 0 0 15px 0; font-weight: 700; text-align: left;}
            .likelihood-display { margin: 15px 0; }
            .likelihood-percentage { font-size: 52px; font-weight: 800; margin: 0; }
            .likelihood-label { font-size: 16px; color: #4b5563; margin: 4px 0; font-weight: 500; }
            .risk-level { display: inline-block; padding: 8px 18px; border-radius: 50px; font-size: 14px; font-weight: 600; color: white; margin: 8px 0; }
            .visual-scale { margin: 25px 0 15px 0; padding: 8px; }
            .scale-container { height: 12px; background: linear-gradient(to right, #16a34a 0%, #f59e0b 50%, #dc2626 100%); border-radius: 6px; position: relative; margin: 8px 0; }
            .scale-indicator { position: absolute; top: -7px; width: 24px; height: 24px; background: white; border-radius: 50%; }
            .scale-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: #6b7280; font-weight: 500; }
            .section { margin-bottom: 20px; padding: 20px; border-radius: 8px; }
            .interpretation-section { background: #f8fafc; border-left: 4px solid #2563eb; }
            .recommendations-section { background: #f0fdf4; border-left: 4px solid #16a34a; }
            .important-notes { background: #fffbeb; border-left: 4px solid #f59e0b; }
            .section-title { font-size: 18px; margin: 0 0 12px 0; font-weight: 700; text-align: left; }
            .interpretation-section .section-title { color: #1e40af; }
            .recommendations-section .section-title { color: #166534; }
            .important-notes .section-title { color: #b45309; }
            .listItem { font-size: 14px; line-height: 1.6; color: #374151; margin-bottom: 8px; padding-left: 5px; }
            .list { list-style-position: outside; padding-left: 20px; margin: 0; }
            .pdf-footer { text-align: center; padding: 20px 0 0 0; border-top: 1px solid #d1d5db; margin-top: 25px; color: #6b7280; font-size: 12px; }
            .pdf-footer-logo { font-weight: 600; color: #2563eb; margin-bottom: 4px; }
            .pdf-tool-list { list-style-type: none; padding-left: 0; margin: 8px 0; font-size: 11px; color: #4b5563; text-align: center; }
            .pdf-tool-list li { margin-bottom: 2px; }
            .confidential { font-style: italic; margin-top: 4px; font-size: 11px; }
            .page-break { page-break-after: always; }
        `;
        const htmlToPrint = `
            <!DOCTYPE html><html><head><meta charset="UTF-8"><title>ADHD Check Report</title><style>${cssString}</style></head>
            <body><div class="page">${reportElement.innerHTML}</div></body></html>`;

        const opt = {
            margin: 0,
            filename: `${userInfo.name}_ADHD_Check_Result.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        html2pdf().from(htmlToPrint).set(opt).save().then(() => {
            setIsDownloading(false);
        }).catch(err => {
            console.error("PDF generation error:", err);
            setIsDownloading(false);
            alert("Sorry, an error occurred while generating the PDF.");
        });
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