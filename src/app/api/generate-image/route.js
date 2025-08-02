import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    // --- MORE ROBUST ERROR HANDLING ---
    // Get the response body as text first, regardless of the status.
    const responseBodyText = await response.text();

    // Now, check if the response was successful.
    if (!response.ok) {
      // If not, the body is the error message from Google Cloud.
      console.error("Error from Google Cloud API:", responseBodyText);
      throw new Error(`API request failed: ${responseBodyText}`);
    }

    // If we are here, the response was successful. Now, safely try to parse the text as JSON.
    let result;
    try {
        result = JSON.parse(responseBodyText);
    } catch (e) {
        console.error("Failed to parse JSON from API response. Body was:", responseBodyText);
        throw new Error("Received an invalid response from the image generation service.");
    }

    if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
      const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      return NextResponse.json({ imageUrl });
    } else {
      // This handles cases where the response is successful but doesn't contain the expected image data.
      console.error("Unexpected API response format:", result);
      throw new Error("Failed to generate image from API response format.");
    }
  } catch (error) {
    console.error("Catch block error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
