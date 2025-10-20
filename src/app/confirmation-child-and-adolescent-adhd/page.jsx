"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import Footer from "../../components/home/Footer";

export default function SuccessChild() {
  const [showModal, setShowModal] = useState(false);

  const emailProviders = [
    { name: "Gmail", url: "https://mail.google.com" },
    { name: "Outlook", url: "https://outlook.live.com" },
    { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
    { name: "AOL Mail", url: "https://mail.aol.com" },
  ];

  return (
    <>
      <section
        className="min-h-screen flex flex-col justify-center items-center 
        bg-gradient-to-br from-[#020B1E] via-[#0A2454] to-[#472C99] 
        px-6 py-12 text-white font-[Montserrat] text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl 
                     p-8 sm:p-10 w-full max-w-md border border-white/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CheckCircle
              size={80}
              className="mx-auto text-[#4EE1B6] drop-shadow-[0_0_12px_#4EE1B6]"
            />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-3 text-[#E5E9FF] leading-tight">
            Payment Successful 🎉
          </h1>
          <p className="text-base sm:text-lg text-[#C9D2FF] leading-relaxed">
            Congratulations! Your payment for the{" "}
            <span className="font-semibold text-white">
              Child & Adolescent ADHD Assessment
            </span>{" "}
            has been processed successfully.
          </p>

          <p className="mt-4 text-sm sm:text-base text-[#C9D2FF]">
            Package value:{" "}
            <span className="font-semibold text-[#4EE1B6]">£1,000</span>
          </p>

          <p className="mt-5 text-[#C9D2FF] text-sm sm:text-base">
            Please check your email for further details. You’ll also receive a
            phone call from our team shortly.
          </p>

          <div className="mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#4EE1B6] text-[#051B40] font-semibold py-3 px-8 
                         rounded-full shadow-lg hover:bg-[#6EF2CA] 
                         transition-all flex items-center justify-center gap-2 mx-auto 
                         text-sm sm:text-base"
            >
              <Mail size={18} />
              Check Your Email
            </button>
          </div>
        </motion.div>

        {/* ===== Modal ===== */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0B1D3A] rounded-2xl p-6 sm:p-8 w-full max-w-sm 
                           text-center border border-[#4EE1B6]/40 shadow-xl"
              >
                <h2 className="text-lg sm:text-xl font-bold text-[#4EE1B6] mb-4">
                  Choose Your Email Provider
                </h2>
                <div className="flex flex-col gap-3">
                  {emailProviders.map((provider) => (
                    <a
                      key={provider.name}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-[#4EE1B6] hover:text-[#0B1D3A] 
                                 text-white font-medium py-3 rounded-full transition text-sm sm:text-base"
                    >
                      {provider.name}
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 text-sm text-[#C9D2FF] hover:text-white transition"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-xs sm:text-sm text-[#9FAEEA]"
        >
          MindHelpa © {new Date().getFullYear()} — Empowering clarity and calm.
        </motion.p>
      </section>

      <Footer />
    </>
  );
}
