"use client";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { marked } from "marked";

// --- Article Modal Component ---
const ArticleModal = ({ post, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <header className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
      </header>
      <main className="p-8 overflow-y-auto">
        <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <div 
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: marked(post.fullContent) }}
        ></div>
      </main>
    </div>
  </div>
);


// --- Blog Post Card Component ---
const BlogPostCard = ({ post, onReadMore }) => (
  <div onClick={() => onReadMore(post)} className="block group cursor-pointer">
    <div className="overflow-hidden rounded-xl shadow-lg">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="bg-white p-6">
      <p className="text-sm font-semibold text-blue-600">{post.category}</p>
      <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
      <p className="mt-3 text-gray-600">{post.description}</p>
    </div>
  </div>
);

// --- Main Blog Page Component ---
export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      imageUrl: "https://images.unsplash.com/photo-1506126613408-4e652a97b216?q=80&w=2940&auto=format&fit=crop",
      category: "Mindfulness",
      title: "The Power of a 5-Minute Meditation for ADHD",
      description: "Discover how a short daily mindfulness practice can dramatically improve focus and reduce impulsivity.",
      fullContent: `
### Taming the 'Thought Tornado'

For many living with Attention-Deficit/Hyperactivity Disorder (ADHD), the mind can feel like a whirlwind of thoughts, ideas, and distractions—a 'thought tornado'. This constant mental chatter can make it incredibly difficult to focus on a single task, leading to procrastination and frustration. But what if you could find a moment of calm in the storm?

Enter the 5-minute meditation. It may sound simple, but incorporating just five minutes of mindfulness into your daily routine can be a transformative tool for the ADHD brain.

### The Science of the Pause

Meditation isn't about emptying your mind; it's about learning to observe your thoughts without judgment. For the ADHD brain, which is often wired for novelty and stimulation, this practice can be challenging but immensely rewarding. Here’s why it works:

- **Strengthens the Prefrontal Cortex:** This is the part of your brain responsible for executive functions like focus, planning, and impulse control—areas where ADHD presents challenges. Regular meditation is like a workout for this brain region.
- **Reduces 'Mind-Wandering':** Studies have shown that mindfulness practice helps to decrease activity in the Default Mode Network (DMN), the brain network associated with mind-wandering and self-referential thought.
- **Improves Emotional Regulation:** By creating a space between a stimulus and your reaction, meditation helps you respond more thoughtfully instead of reacting impulsively to emotions.

### Your 5-Minute Practice

Ready to try? Find a quiet space where you won't be disturbed for five minutes.

1.  **Get Comfortable (15 seconds):** Sit in a chair with your feet flat on the floor and your back straight but not stiff. Rest your hands on your lap. Close your eyes gently.
2.  **Focus on Your Breath (1 minute):** Bring your attention to the sensation of your breath. Notice the feeling of the air entering your nostrils, filling your lungs, and then leaving your body. Don't try to change it; just observe.
3.  **Acknowledge Thoughts (3 minutes):** Your mind *will* wander. That's okay. When you notice a thought has pulled you away, gently acknowledge it ("thinking") and then guide your focus back to your breath. The act of returning your focus is the most important part of the exercise.
4.  **Body Scan (30 seconds):** Briefly bring your attention to the sensations in your body. Notice the feeling of your feet on the floor, your hands on your lap.
5.  **Gently Conclude (15 seconds):** Slowly bring your awareness back to the room around you. When you're ready, gently open your eyes.

Consistency is more important than duration. A daily 5-minute practice is far more effective than a 30-minute session once a week. Start small, be kind to yourself, and watch as you gradually build the mental muscle to find calm within the chaos.
      `
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop",
      category: "Productivity",
      title: "Taming the To-Do List: Strategies for ADHD",
      description: "Feeling overwhelmed by your tasks? Learn three actionable strategies to prioritize, organize, and conquer your to-do list.",
      fullContent: `
### The Wall of Awful

For individuals with ADHD, a simple to-do list can feel like an insurmountable 'Wall of Awful'. Each task represents not just the work itself, but also the potential for distraction, boredom, and frustration. This is why many with ADHD struggle with procrastination. The key isn't to just 'try harder', but to use strategies that work *with* your brain, not against it.

Here are three powerful techniques to transform your to-do list from a source of stress into a tool for success.

### 1. The '1-3-5' Rule

Instead of a single, endless list, structure your day with the 1-3-5 rule. Each day, decide on:
- **1** Big Thing: Your most important task.
- **3** Medium Things: Significant tasks that need to get done.
- **5** Small Things: Quick, easy tasks you can check off.

This method forces you to prioritize and provides a clear, achievable structure. Completing the small tasks first can build momentum, making the bigger tasks feel less daunting.

### 2. Time Blocking & The Pomodoro Technique

ADHD brains often struggle with time perception. Time blocking helps by assigning a specific time slot for each task on your calendar. This creates a visual representation of your day and adds a sense of urgency.

Combine this with the **Pomodoro Technique**:
1.  Choose a task.
2.  Set a timer for 25 minutes.
3.  Work on the task without interruption.
4.  When the timer rings, take a 5-minute break.
5.  After four 'Pomodoros', take a longer 15-30 minute break.

This technique breaks down work into manageable chunks and leverages the ADHD brain's need for novelty and frequent rewards (the breaks).

### 3. The 'Done' List

The constant forward-looking nature of a to-do list can be demoralizing. Counter this by keeping a 'Done' list. At the end of each day, write down everything you accomplished, no matter how small.

This practice helps to:
- **Combat negative self-talk:** It provides concrete evidence of your productivity.
- **Boost dopamine:** Acknowledging your achievements provides a small but significant reward for your brain.
- **Identify patterns:** Over time, you can see which days are most productive and why.

By implementing these strategies, you can begin to tame the to-do list and build a more productive, less stressful relationship with your tasks.
      `
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2900&auto=format&fit=crop",
      category: "Relationships",
      title: "Communicating Your Needs with ADHD",
      description: "Learn effective communication techniques to help your partners, friends, and colleagues understand your perspective.",
      fullContent: `
### "Why Can't You Just...?"

If you have ADHD, you've likely heard some version of this question: "Why can't you just remember?", "Why can't you just focus?", "Why can't you just be on time?". These questions, often born from frustration, can be incredibly hurtful because they imply a lack of effort rather than a difference in brain wiring.

Effective communication is key to bridging this gap and fostering healthier relationships. It's about translating your internal experience into a language that neurotypical people can understand.

### Strategy 1: Externalize, Don't Excuse

Instead of saying "I'm sorry, I forgot" (which can sound like an excuse over time), try externalizing the symptom.

- **Instead of:** "I'm sorry I'm late, I lost track of time."
- **Try:** "My ADHD makes it really hard for me to perceive time accurately. I'm working on it by setting multiple alarms, but I'm sorry for the impact it had on you."

This approach doesn't absolve you of responsibility, but it frames the issue as a symptom to be managed, not a character flaw. It separates *you* from the *ADHD*.

### Strategy 2: The 'Need' Statement

People with ADHD often have specific needs to function at their best (e.g., needing quiet to focus, needing to fidget to listen). Clearly stating these needs can prevent misunderstandings. Use the "I need..." formula.

- **Instead of:** Snapping at a colleague for interrupting you.
- **Try:** "I need about 30 minutes of uninterrupted focus to finish this report. Could we talk right after that?"

- **Instead of:** Zoning out during a long conversation.
- **Try:** "I find it easier to listen when I can doodle or use a fidget tool. It helps my brain stay engaged with what you're saying."

### Strategy 3: Ask for Specific Support

Don't be afraid to ask for the specific help you need. People often want to help but don't know how.

- **Instead of:** "I'm so overwhelmed with this project."
- **Try:** "I'm feeling overwhelmed by this project. Could you help me break down the first three steps?"

- **Instead of:** Forgetting an important task.
- **Try:** "This is really important. Would you be willing to send me a quick reminder text an hour before?"

By communicating clearly and proactively, you can transform your relationships from a source of conflict into a source of support, fostering understanding and teamwork in managing the challenges of ADHD.
      `
    },
  ];
  
  const featuredPost = posts[0]; // The first post is the featured one
  const otherPosts = posts.slice(1);

  return (
    <div className="bg-gray-50">
      {/* --- Hero Section --- */}
      <div className="py-24 sm:py-32 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Insights for a Focused Life
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Articles, strategies, and stories to help you navigate the world of ADHD with confidence and clarity.
          </p>
        </div>
      </div>

      {/* --- Featured Post Section --- */}
      <div className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div onClick={() => setSelectedPost(featuredPost)} className="block group cursor-pointer">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                        <img 
                            src={featuredPost.imageUrl} 
                            alt={featuredPost.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-blue-600">{featuredPost.category}</p>
                        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {featuredPost.title}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">{featuredPost.description}</p>
                        <span className="mt-6 inline-flex items-center font-semibold text-blue-600 group-hover:underline">
                            Read Full Story <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- All Posts Section --- */}
      <div className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {otherPosts.map((post, index) => (
              <BlogPostCard key={index} post={post} onReadMore={setSelectedPost} />
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {selectedPost && (
        <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};
