"use client";

import React, { useEffect } from 'react';

/**
 * BookingPage Component (Using Calendly)
 *
 * This component embeds the Calendly Appointment Scheduling inline widget,
 * ensuring it is responsive and visually integrated.
 */
const BookingPage = () => {
    // 1. The Calendly URL for the specific booking schedule.
    const CALENDLY_URL = "https://calendly.com/dr_alaneme/mindhelpa-psychiatrist-led-coaching";

    // 2. Load the Calendly script only once when the component mounts.
    // This hook requires the component to be a Client Component.
    useEffect(() => {
        // Create the script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        
        // Append it to the document body
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []); 

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-sans">
            
            {/* Header Card */}
            <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-6 text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
                    Book Your Appointment
                </h1>
                <p className="text-gray-600 text-lg">
                    Select a date and time that works best for you directly in the calendar below.
                </p>
            </div>

            {/* Booking Widget Container */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                
                {/* Calendly Inline Widget Div */}
                <div 
                    className="calendly-inline-widget" 
                    data-url={CALENDLY_URL} 
                    style={{ 
                        minWidth: '320px', 
                        height: '700px' 
                    }}
                >
                </div>
                
            </div>
            
            {/* Footer / Instructions */}
            <div className="w-full max-w-4xl mt-6 p-4 text-center text-sm text-gray-500">
                All bookings are automatically confirmed and added to your calendar. You will receive an email confirmation shortly after.
            </div>
            
        </div>
    );
};

export default BookingPage;