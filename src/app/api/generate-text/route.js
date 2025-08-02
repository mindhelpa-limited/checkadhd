import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { activityType } = await request.json();
    let prompt, title, generationConfig = {}, imagePrompt = "";

    switch (activityType) {
        case "Meditation":
            prompt = "Generate a 7-minute guided meditation script for improving focus in adults with ADHD. Use markdown for formatting.";
            title = "Daily Focus Meditation";
            imagePrompt = "A serene, minimalist illustration of a calm lake at dawn, representing mental clarity.";
            break;
        case "Passage":
            prompt = "Generate a short, engaging, one-page passage about a specific coping mechanism for ADHD. Use markdown for formatting. After the passage, create a JSON object for a quiz with 3 multiple-choice questions about the text. Each question should have a 'question' string, an 'options' array of 4 strings, and a 'correctAnswer' string that is one of the options.";
            title = "ADHD Passage of the Day";
            generationConfig = { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { "passage": { "type": "STRING" }, "quiz": { "type": "ARRAY", "items": { "type": "OBJECT", "properties": { "question": { "type": "STRING" }, "options": { "type": "ARRAY", "items": { "type": "STRING" } }, "correctAnswer": { "type": "STRING" } } } } } } };
            imagePrompt = "An abstract image representing focus and organization, with chaotic lines becoming orderly.";
            break;
        case "Focus Exercise":
            prompt = "Describe a simple 7-minute focus exercise for adults with ADHD. Use markdown for formatting.";
            title = "Daily Focus Exercise";
            imagePrompt = "A close-up photograph of a single, intricate object, like a leaf or a watch, symbolizing detailed observation.";
            break;
        default:
            throw new Error("Invalid activity type");
    }
    
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig };
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();

    if (!response.ok) throw new Error(result?.error?.message || `API request failed`);
    
    const text = result.candidates[0].content.parts[0].text;
    const content = activityType === 'Passage' ? JSON.parse(text) : text;

    return NextResponse.json({ content, title, imagePrompt });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
