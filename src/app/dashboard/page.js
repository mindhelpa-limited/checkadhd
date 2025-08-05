"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

// --- Loader Component for a clean loading screen experience ---
const FullScreenLoader = ({ message }) => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700 font-semibold text-lg">{message}</p>
    </div>
);

// --- Task Component ---
const Task = ({ task, onToggle }) => (
    <div className={`p-4 rounded-xl shadow-sm flex items-center justify-between transition-colors duration-300
        ${task.completed ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-800'}`}>
        <span className="font-medium text-lg">{task.title}</span>
        <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
        />
    </div>
);

// --- Main Recovery Page Component ---
export default function RecoveryPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the tasks for the current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
            
            const tasksCollectionRef = collection(db, `users/${currentUser.uid}/recoveryTasks`);
            
            try {
                const querySnapshot = await getDocs(query(tasksCollectionRef));
                const fetchedTasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTasks(fetchedTasks);
            } catch (error) {
                console.error("Error fetching recovery tasks:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Function to handle toggling a task's completion status
    const handleToggleTask = async (taskId) => {
        if (!user) return;
        const taskRef = doc(db, `users/${user.uid}/recoveryTasks`, taskId);
        
        // Find the task and update its completion status locally
        const updatedTasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);

        // Update the task in Firestore
        try {
            await setDoc(taskRef, { ...tasks.find(t => t.id === taskId), completed: !tasks.find(t => t.id === taskId).completed }, { merge: true });
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    if (loading) {
        return <FullScreenLoader message="in less than 5 minutes" />;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Daily Recovery Tasks</h1>
            <p className="text-gray-600 mb-6">
                Complete these tasks to track your recovery journey.
            </p>

            <div className="grid grid-cols-1 gap-4">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <Task key={task.id} task={task} onToggle={handleToggleTask} />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No tasks found. Add some to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
