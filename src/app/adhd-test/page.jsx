"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./assessment.module.css";
import Report from "./Report";
import { auth, db } from "@/lib/firebase"; // ✅ make sure this path is correct
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const confetti = dynamic(() => import("canvas-confetti"), { ssr: false });
const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

const questions = [
  /* your full list of questions */
];

const options = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];
const milestoneMessages = [
  "Keep Going!",
  "Great Focus!",
  "You're Doing Great!",
  "Excellent Progress!",
  "Fantastic Effort!",
];

export default function AdhdTestPage() {
  const [step, setStep] = useState("form");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() =>
    new Array(questions.length).fill(null)
  );
  const [userInfo, setUserInfo] = useState({ name: "", sex: "", dob: "" });
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [milestoneNotification, setMilestoneNotification] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // ✅ load resume state if exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStateJSON = localStorage.getItem("adhdAssessmentState");
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (
          savedState &&
          savedState.current < questions.length &&
          savedState.current > 0
        ) {
          setUserInfo(savedState.userInfo);
          setShowResumeDialog(true);
        }
      }
    }
  }, []);

  // ✅ save quiz progress
  useEffect(() => {
    if (typeof window !== "undefined" && step === "quiz") {
      const state = { current, answers, userInfo };
      localStorage.setItem("adhdAssessmentState", JSON.stringify(state));
    }
  }, [current, answers, userInfo, step]);

  // ✅ Save results to Firestore
  async function saveResultsToFirestore(answers, userInfo) {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Calculate score percentage
    const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);
    const maxScore = answers.length * 4;
    const scorePercentage = Math.round((totalScore / maxScore) * 100);

    let level, riskLevelText;
    if (scorePercentage >= 75) {
      level = "High likelihood of ADHD traits";
      riskLevelText = "High Risk";
    } else if (scorePercentage >= 40) {
      level = "Moderate likelihood of ADHD traits";
      riskLevelText = "Moderate Risk";
    } else {
      level = "Low likelihood of ADHD traits";
      riskLevelText = "Low Risk";
    }

    const colRef = collection(db, "users", currentUser.uid, "results");
    await addDoc(colRef, {
      answers,
      assessmentTimestamp: serverTimestamp(),
      userName: userInfo.name,
      sex: userInfo.sex,
      dob: userInfo.dob,
      scorePercentage,
      level,
      riskLevelText,
    });
  }

  const handleStart = () => {
    if (!userInfo.name || !userInfo.sex || !userInfo.dob) {
      alert("Please complete all fields.");
      return;
    }
    setAnswers(new Array(questions.length).fill(null));
    setCurrent(0);
    setStep("quiz");
    if (typeof window !== "undefined")
      localStorage.removeItem("adhdAssessmentState");
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[current] = answerIndex;
    setAnswers(newAnswers);

    if ((current + 1) % 5 === 0 && current < questions.length - 1) {
      const message =
        milestoneMessages[Math.floor(Math.random() * milestoneMessages.length)];
      setMilestoneNotification(`🎉 ${message} 🎉`);

      import("canvas-confetti").then((module) =>
        module.default({ particleCount: 150, spread: 100, origin: { y: 0.6 } })
      );

      setTimeout(() => setMilestoneNotification(""), 3500);
    }

    setTimeout(async () => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        // ✅ Save results before showing them
        await saveResultsToFirestore(newAnswers, userInfo);

        setStep("results");
        if (typeof window !== "undefined")
          localStorage.removeItem("adhdAssessmentState");

        import("canvas-confetti").then((module) =>
          module.default({ particleCount: 250, spread: 160, origin: { y: 0.3 } })
        );
      }
    }, 300);
  };

  const handleDownloadPDF = () => {
    if (typeof window === "undefined") return;

    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    setIsDownloading(true);
    import("html2pdf.js").then((html2pdf) => {
      const opt = {
        margin: 0,
        filename: `${userInfo.name}_ADHD_Check_Result.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf.default().from(reportElement).set(opt).save().finally(() => {
        setIsDownloading(false);
      });
    });
  };

  return (
    <div
      className={`${styles.adhdContainer} ${
        step === "results" ? styles.fullWidth : ""
      }`}
    >
      {/* keep your full JSX UI from before */}
      {step === "results" && (
        <div>
          <Report userInfo={userInfo} answers={answers} />
          <button onClick={handleDownloadPDF} disabled={isDownloading}>
            {isDownloading ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>
      )}
    </div>
  );
}
