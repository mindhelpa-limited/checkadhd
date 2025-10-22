import React from 'react';

/**
 * BookingPage Component
 *
 * This component embeds the Google Calendar Appointment Scheduling iframe,
 * ensuring it is responsive and visually integrated.
 *
 * NOTE: Due to cross-origin security policies, external controls (like a
 * dropdown) cannot directly manipulate the content (like pre-selecting
 * dates) inside the embedded Google Calendar iframe. The user must make
 * their selection directly within the calendar widget below.
 */
const BookingPage = () => {
     // The updated Google Calendar URL provided by the user
     const CALENDAR_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2GweMnsjZAOzpy9ZqWDSQO8GU_anXk91ageGhtNBt1Xm1esSPfqBTXQb7fyBeKhK7sp_IgS0Iq?gv=true";

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
                 <div className="relative w-full" style={{ height: '700px' }}>
                     {/* Iframe for Google Calendar */}
                     <iframe 
                         src={CALENDAR_URL} 
                         style={{ 
                             border: '0', 
                             width: '100%', 
                             height: '100%', 
                             borderRadius: '0.75rem' // Match the container's rounded corners
                         }}
                         frameBorder="0"
                         title="Google Calendar Appointment Scheduling"
                         loading="lazy"
                     />
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
