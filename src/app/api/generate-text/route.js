import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { activityType, score } = await request.json();
    let prompt, title;
    
    // Determine the severity level based on score (assuming max score is around 365)
    const severity = score > 250 ? 'severe' : score > 150 ? 'moderate' : 'mild';

    switch (activityType) {
        case "Meditation":
            prompt = `Generate a 7-minute guided meditation script for an adult with ${severity} ADHD symptoms. The script should be focused on improving attention and reducing mental clutter. Make the tone calm and encouraging. Use markdown for formatting, including clear section headers like "Introduction," "Body Scan," "Focused Breathing," and "Conclusion."`;
            title = "Mindful Focus Meditation";
            break;
        case "Passage":
            prompt = `For an adult with ${severity} ADHD, generate a short, engaging, one-page passage about a specific, actionable coping mechanism. The passage should be written in a friendly, conversational tone and include a relatable personal anecdote. Use markdown for formatting. After the passage, create a JSON object for a quiz with 3 multiple-choice questions about the text. Each question must have a 'question' string, an 'options' array of 4 strings, and a 'correctAnswer' string that is one of the options.`;
            title = "AHA! Moment: An ADHD Insight";
            break;
        case "Focus Exercise":
            prompt = `For an adult with ${severity} ADHD, describe a simple, fun 7-minute focus-building exercise. The exercise should be easy to start and require minimal materials. Explain the steps clearly and concisely using a bulleted list. Provide a short, motivating introduction. Use markdown for formatting.`;
            title = "The 7-Minute Focus Challenge";
            break;
        default:
            throw new Error("Invalid activity type");
    }
    
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`; // Switched to 1.5 for better structured output

    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();

    if (!response.ok) throw new Error(result?.error?.message || `API request failed`);
    
    let content = result.candidates[0].content.parts[0].text;
    
    // Try to parse JSON for the 'Passage' type
    if (activityType === 'Passage') {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON object found in the passage content.');
        }
      } catch (e) {
        console.error('Failed to parse JSON for Passage:', e);
        // Fallback to a plain text version if parsing fails
        content = { passage: content, quiz: [] };
      }
    }
    
    return NextResponse.json({ content, title });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}