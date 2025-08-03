"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./assessment.module.css";
import Report from "./Report";

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

  // ✅ Run only in browser
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

  useEffect(() => {
    if (typeof window !== "undefined" && step === "quiz") {
      const state = { current, answers, userInfo };
      localStorage.setItem("adhdAssessmentState", JSON.stringify(state));
    }
  }, [current, answers, userInfo, step]);

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

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
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
      {/* ... Keep the rest of your JSX unchanged ... */}
    </div>
  );
}
