// /functions/index.js

const admin = require('firebase-admin');
const functions = require('firebase-functions/v2'); 

// --- 1. INITIALIZE ADMIN SDK ---
// This line correctly loads the Service Account Key file you placed in this folder.
const serviceAccount = require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// --- 2. SCHEDULED REMINDER LOGIC ---

/**
 * This function is scheduled to run on the server every day at midnight (00:00) UTC.
 * It iterates through all users and checks who is eligible for a reminder.
 */
exports.dailyReminderCheck = functions.scheduler.onSchedule('0 0 * * *', async (context) => {

    // Your project ID, confirmed from your key file content:
    const APP_ID = 'adhdcheckwebapp'; 

    // 1. Get ALL users and their data from Firestore
    // Assumes your user data is stored at: artifacts/adhdcheckwebapp/users/{userId}
    const usersSnapshot = await db.collection('artifacts').doc(APP_ID).collection('users').get();
    
    const messages = [];
    const today = new Date();
    // Get today's date string for simple check-in comparison (e.g., "2025-09-25")
    const todayString = today.toISOString().split('T')[0];

    console.log(`Starting daily check for users on ${todayString} (UTC).`);


    // 2. Loop through every user
    usersSnapshot.forEach(doc => {
        const userData = doc.data();

        // **CRITICAL Data Points** - These must be saved by your frontend app:
        const token = userData.fcmToken;            // The device's push notification token
        const lastCheckIn = userData.lastCheckInDate; // The last date the user completed a goal/checked in

        // Check if the user has goals and hasn't checked in today
        const hasGoals = userData.dailyGoals && userData.dailyGoals.length > 0;
        const hasNotCheckedInToday = lastCheckIn !== todayString;

        if (token && hasGoals && hasNotCheckedInToday) {
            
            // For simplicity, we skip complex timezone checks and send the reminder now.
            messages.push({
                token: token,
                notification: {
                    title: 'Time to Conquer Your Goals 👑',
                    body: 'Your daily check-in is pending! Don’t let your streak slip away.'
                },
                // Add data payload so your Next.js/mobile app knows what to do when clicked
                data: {
                    type: 'reminder',
                    target: 'goal-tracker'
                }
            });
        }
    });

    // 3. Send all compiled notifications in a batch
    if (messages.length > 0) {
        console.log(`Attempting to send ${messages.length} messages.`);
        // Send the notifications using Firebase Cloud Messaging
        await admin.messaging().sendEach(messages);
        console.log(`Successfully completed batch send.`);
    } else {
        console.log('No users eligible for a reminder today.');
    }

    return null;
});