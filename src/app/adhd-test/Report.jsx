"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from './assessment.module.css';
import { saveReportCapture } from '@/lib/resultsSaver';

const getScoreDetails = (answers) => {
  const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);
  const questionsCount = answers.length;
  const maxScore = questionsCount * 4;
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  let level, riskColor, riskLevelText, interpretationText, scaleIndicatorPos;

  if (scorePercentage >= 75) {
    level = "High likelihood of ADHD traits";
    riskColor = "#dc2626";
    riskLevelText = "High Risk";
    interpretationText = [
      "This assessment combines responses to questions related to attention, hyperactivity, and impulsivity.",
      "Your result indicates a high probability of experiencing clinically significant ADHD symptoms.",
      "Your responses suggest frequent and significant challenges in areas commonly affected by ADHD."
    ];
    scaleIndicatorPos = Math.min(95, scorePercentage - 2);
  } else if (scorePercentage >= 40) {
    level = "Moderate likelihood of ADHD traits";
    riskColor = "#f59e0b";
    riskLevelText = "Moderate Risk";
    interpretationText = [
      "This assessment combines responses to questions related to attention, hyperactivity, and impulsivity.",
      "Your result indicates a moderate probability of experiencing some ADHD symptoms.",
      "Your responses suggest noticeable challenges in areas commonly affected by ADHD. Further exploration might be beneficial."
    ];
    scaleIndicatorPos = Math.max(35, Math.min(65, scorePercentage - 2));
  } else {
    level = "Low likelihood of ADHD traits";
    riskColor = "#16a34a";
    riskLevelText = "Low Risk";
    interpretationText = [
      "This assessment combines responses to questions related to attention, hyperactivity, and impulsivity.",
      "Your result indicates a low probability of experiencing clinically significant ADHD symptoms based on this self-assessment.",
      "Your responses suggest minimal challenges in areas commonly affected by ADHD."
    ];
    scaleIndicatorPos = Math.max(5, scorePercentage - 2);
  }
  return { scorePercentage, level, riskColor, riskLevelText, interpretationText, scaleIndicatorPos };
};

export default function Report({ userInfo, answers, assessmentTimestamp }) {
  const { scorePercentage, level, riskColor, riskLevelText, interpretationText, scaleIndicatorPos } =
    useMemo(() => getScoreDetails(answers || []), [answers]);

  const logoUrl = "https://adhdcheck.net/wp-content/uploads/2025/06/cropped-Untitled-design_20250602_130916_0000-min.png";

  const reportDate = useMemo(() => {
    return assessmentTimestamp && assessmentTimestamp.seconds
      ? new Date(assessmentTimestamp.seconds * 1000)
      : new Date();
  }, [assessmentTimestamp]);

  const formattedDob = userInfo?.dob
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(userInfo.dob))
    : 'N/A';
  const assessmentDate = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(reportDate);
  const assessmentTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(reportDate);

  const toolList = [
    "Adult ADHD Self-Report Scale (ASRS)", "DSM-5 ADHD Criteria", "Conners' Adult ADHD Rating Scales (CAARS)",
    "Barkley Adult ADHD Rating Scale (BAARS-IV)", "Brown Attention-Deficit Disorder Symptom Assessment Scale (BADDS)",
    "Wender Utah Rating Scale (WURS)", "Executive Functioning Questionnaires"
  ];

  // === NEW: save exactly once (Firestore if signed-in, else localStorage) ===
  const savedOnce = useRef(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (savedOnce.current) return;
    if (!Array.isArray(answers) || answers.length === 0) return; // guard

    savedOnce.current = true;

    saveReportCapture({
      takenAt: reportDate,
      scorePercentage,
      level,
      riskLevelText,
      version: "v1.0",
      userName: userInfo?.name ?? null,
      sex: userInfo?.sex ?? null,
      dob: userInfo?.dob ?? null,
    })
      .then(({ id }) => setSavedId(id))
      .catch((e) => {
        console.error("Failed to save result:", e);
        savedOnce.current = false; // allow retry on next render if needed
      });
  }, [answers, reportDate, scorePercentage, level, riskLevelText, userInfo]);

  return (
    <div id="report-content" className={styles.onScreenReportWrapper}>
      <div className={styles.pdfHeader}>
        <div className={styles.logoContainerPdf}>
          <img src={logoUrl} alt="ADHD Check Logo" className={styles.logoImagePdf} crossOrigin="anonymous" />
          <h1 className={styles.mainReportTitlePdf}>ADHD Check</h1>
        </div>
        <p className={styles.subtitleReportPdf}>Professional ADHD Self-Assessment</p>
      </div>

      <div className={styles.patientInfo}>
        <h2 className={styles.sectionTitle}>Participant Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Full Name</span><span className={styles.infoValue}>{userInfo?.name ?? '—'}</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Date of Birth</span><span className={styles.infoValue}>{formattedDob}</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Sex</span><span className={styles.infoValue}>{userInfo?.sex ?? '—'}</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Assessment Date</span><span className={styles.infoValue}>{assessmentDate}</span></div>
          <div className={styles.infoItem}><span className={styles.infoLabel}>Assessment Time</span><span className={styles.infoValue}>{assessmentTime}</span></div>
        </div>
      </div>

      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>ADHD Trait Likelihood Assessment</h2>
        <div className={styles.likelihoodDisplay}>
          <p className={styles.likelihoodPercentage} style={{ color: riskColor }}>{scorePercentage}%</p>
          <p className={styles.likelihoodLabel}>{level}</p>
          <div className={styles.riskLevel} style={{ backgroundColor: riskColor }}>{riskLevelText}</div>
        </div>
        <div className={styles.visualScale}>
          <div className={styles.scaleContainer}>
            <div className={styles.scaleIndicator} style={{ left: `${scaleIndicatorPos}%`, border: `3px solid ${riskColor}` }}></div>
          </div>
          <div className={styles.scaleLabels}><span>Low (0-39%)</span><span>Moderate (40-74%)</span><span>High (75-100%)</span></div>
        </div>
      </div>

      <div className={`${styles.interpretationSection} ${styles.section}`}>
        <h3 className={styles.sectionTitle}>Understanding Your Results</h3>
        <ul className={styles.list}>{interpretationText.map((item, index) => <li key={index} className={styles.listItem}>{item}</li>)}</ul>
      </div>

      <div className={styles.pageBreak} />

      <div className={`${styles.recommendationsSection} ${styles.section}`}>
        <h3 className={styles.sectionTitle}>Recommended Next Steps & Strategies</h3>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>Consult a Professional:</strong> Discuss these results with a doctor, psychiatrist, or psychologist for a comprehensive clinical evaluation.</li>
          <li className={styles.listItem}><strong>Behavioral Strategies:</strong> Explore time management techniques, organizational systems, and minimizing distractions.</li>
          <li className={styles.listItem}><strong>Lifestyle Adjustments:</strong> Regular physical exercise, a balanced diet, and adequate sleep can significantly impact ADHD symptoms.</li>
        </ul>
      </div>

      <div className={`${styles.importantNotes} ${styles.section}`}>
        <h3 className={styles.sectionTitle}>Important Disclaimers</h3>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>Screening Tool Only:</strong> This is an informational self-assessment tool. It does not provide a clinical diagnosis.</li>
          <li className={styles.listItem}><strong>Professional Evaluation Required:</strong> For an accurate diagnosis, please consult with a qualified healthcare provider.</li>
        </ul>
      </div>

      <div className={styles.pdfFooter}>
        <div className={styles.pdfFooterLogo}>ADHD Check</div>
        <p>Generated using clinically-validated ADHD assessment tools:</p>
        <ul className={styles.pdfToolList}>
          {toolList.slice(0, 4).map(tool => <li key={tool}>{tool}</li>)}
        </ul>
        <p className={styles.confidential}>This report is confidential and intended for the assessed individual's review.</p>
        <p style={{ marginTop: '10px', fontSize: '10px', color: '#9ca3af' }}>©{new Date().getFullYear()} Mindhelpa Ltd. All rights reserved.</p>
      </div>

      {/* NEW: success banner with links */}
      {savedId && (
        <div className={styles.section} style={{ marginTop: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 12, background: '#f0fdf4' }}>
          <div style={{ fontWeight: 600 }}>Saved to your history ✅</div>
          <div style={{ fontSize: 14, color: '#374151' }}>You can revisit or share this result.</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
            <a className={styles.link} href={`/results/${savedId}`}>Open this result</a>
            <a className={styles.link} href="/test-history">See all results</a>
          </div>
        </div>
      )}
    </div>
  );
}
