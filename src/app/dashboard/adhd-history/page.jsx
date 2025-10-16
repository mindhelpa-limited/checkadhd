"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, FileText, X, Download, CheckCircle } from "lucide-react";
import DatePicker from "react-datepicker";
// This path is now corrected based on your file structure.
import Report from "../adhd-test/Report"; 

import "react-datepicker/dist/react-datepicker.css";

// --- Helper Functions ---
const getRiskStyling = (riskLevel) => {
  switch (riskLevel) {
    case "High Risk":
      return {
        gradient: "from-red-500 to-red-700",
        borderColor: "border-red-500/50",
      };
    case "Moderate Risk":
      return {
        gradient: "from-amber-500 to-amber-700",
        borderColor: "border-amber-500/50",
      };
    case "Low Risk":
    default:
      return {
        gradient: "from-green-500 to-green-700",
        borderColor: "border-green-500/50",
      };
  }
};

const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

// === MAIN COMPONENT ===
export default function ReportHistoryPage() {
  const router = useRouter();
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter State ---
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'today', 'yesterday'
  const [selectedDate, setSelectedDate] = useState(null);

  // --- Modal & Download State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);


  // --- Effect for Auth and Data Fetching ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const resultsRef = collection(db, "users", user.uid, "results");
        const q = query(resultsRef, orderBy("takenAt", "desc"));

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const fetchedResults = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            takenAt: doc.data().takenAt.toDate(),
          }));
          setAllResults(fetchedResults);
          setLoading(false);
        }, (err) => {
          console.error("Error fetching results:", err);
          setError("Failed to load assessment history.");
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- Effect for Filtering Results ---
  useEffect(() => {
    let newFilteredResults = [...allResults];

    if (selectedDate) {
        newFilteredResults = allResults.filter(result => isSameDay(result.takenAt, selectedDate));
    } else {
        if (activeTab === 'today') {
            const today = new Date();
            newFilteredResults = allResults.filter(result => isSameDay(result.takenAt, today));
        } else if (activeTab === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            newFilteredResults = allResults.filter(result => isSameDay(result.takenAt, yesterday));
        }
    }
    setFilteredResults(newFilteredResults);
  }, [activeTab, selectedDate, allResults]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedDate(null); // Clear date picker when a tab is clicked
  };

  const handleDateChange = (date) => {
      setSelectedDate(date);
      setActiveTab('all'); // De-select tabs when a date is picked
  }

  const handleViewReport = (result) => {
    // Check if the required data exists before opening the modal
    if (!result.userInfo || !result.answers) {
        alert("This report cannot be previewed because it's missing detailed data. Only newer reports can be viewed.");
        return;
    }
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleDownloadPDF = async () => {
     if (!selectedResult || !selectedResult.userInfo) return;

    setIsDownloading(true);
    try {
        const html2pdfModule = (await import("html2pdf.js")).default;
        const element = document.getElementById("report-content-modal");
        if (!element) return;
        await html2pdfModule()
            .from(element)
            .set({
                margin: [10, 10, 10, 10],
                filename: `ADHD_Assessment_Report_${selectedResult.userInfo.name.replace(/\s/g, "_")}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .save();
        setIsDownloading("success");
        setTimeout(() => {
            setIsDownloading(false);
            setIsModalOpen(false); // Optionally close modal after download
        }, 3000);
    } catch (e) {
        console.error("Download failed:", e);
        setIsDownloading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* === HEADER === */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Assessment History
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Review and track your past ADHD assessment results.
          </p>
        </div>

        {/* === FILTERING CONTROLS === */}
        <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-2xl mb-8 border border-gray-700 flex flex-col md:flex-row gap-4">
             {/* TABS */}
            <div className="flex-shrink-0 flex items-center gap-2 bg-gray-900 p-2 rounded-lg">
                {['all', 'today', 'yesterday'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* DATE PICKER */}
            <div className="relative w-full">
                <Calendar className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    placeholderText="Or select a specific date"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 pl-10 text-white focus:ring-blue-500 focus:border-blue-500"
                    isClearable
                />
            </div>
        </div>

        {/* === RESULTS LIST === */}
        <div>
          {loading && <div className="text-center p-10"><Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" /></div>}
          {!loading && error && <p className="text-center text-red-400">{error}</p>}
          {!loading && !error && filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {filteredResults.map((result) => {
                const styling = getRiskStyling(result.riskLevelText);
                return (
                  <div
                    key={result.id}
                    className={`bg-gray-800 p-6 rounded-2xl shadow-lg border-l-8 ${styling.borderColor} transition-transform hover:scale-[1.01]`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                             <p className="text-sm text-gray-400 font-medium">
                                {result.takenAt.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-2xl font-bold text-white mt-1">{result.level}</p>
                            <button onClick={() => handleViewReport(result)} className="mt-4 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg">
                                View & Download Report
                            </button>
                        </div>
                        <div className={`text-center p-4 rounded-lg bg-gradient-to-br ${styling.gradient}`}>
                             <p className="text-4xl font-extrabold text-white">{result.scorePercentage}%</p>
                             <p className="text-sm font-semibold opacity-90">{result.riskLevelText}</p>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          {!loading && !error && filteredResults.length === 0 && (
             <div className="text-center p-10 bg-gray-800/50 rounded-2xl border border-gray-700">
                <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">No Results Found</h3>
             </div>
          )}
        </div>
      </div>

       {/* === REPORT PREVIEW MODAL === */}
        {isModalOpen && selectedResult && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
                <div className="bg-gray-800 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                         <h3 className="font-bold text-xl">Report Preview</h3>
                         <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-700"><X size={20}/></button>
                    </div>
                    <div className="p-6 overflow-y-auto" id="report-modal-content-wrapper">
                         {/* We change the ID here to avoid conflicts */}
                         <div id="report-content-modal">
                            <Report userInfo={selectedResult.userInfo} answers={selectedResult.answers} />
                         </div>
                    </div>
                     <div className="p-4 border-t border-gray-700 flex-shrink-0">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading !== false}
                            className={`w-full px-6 py-3 font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${isDownloading === "success" ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {isDownloading === true && <Loader2 className="h-5 w-5 animate-spin" />}
                            {isDownloading === "success" && <CheckCircle className="h-5 w-5" />}
                            {isDownloading === false && <Download className="h-5 w-5" />}
                            <span>
                                {isDownloading === true && "Generating PDF..."}
                                {isDownloading === "success" && "Downloaded!"}
                                {isDownloading === false && "Download Detailed Report"}
                            </span>
                        </button>
                     </div>
                </div>
            </div>
        )}
    </div>
  );
}