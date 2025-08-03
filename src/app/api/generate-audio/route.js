import { NextResponse } from "next/server";

// ✅ Use Buffer instead of atob/FileReader/Blob (server-friendly)
function base64ToArrayBuffer(base64) {
  const buffer = Buffer.from(base64, "base64");
  return new Uint8Array(buffer).buffer;
}

function pcmToWav(pcmData, sampleRate) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmData.length * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(44 + i * 2, pcmData[i], true);
  }

  return Buffer.from(new Uint8Array(view.buffer));
}

export async function POST(request) {
  try {
    const { text } = await request.json();

    const payload = {
      contents: [{ parts: [{ text: `Say this in a calm, soothing female voice: ${text}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } }
        }
      },
      model: "gemini-2.5-flash-preview-tts",
    };

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    const audioData = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType;

    if (audioData && mimeType && mimeType.startsWith("audio/")) {
      const sampleRateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;

      const pcmData = base64ToArrayBuffer(audioData);
      const pcm16 = new Int16Array(pcmData);
      const wavBuffer = pcmToWav(pcm16, sampleRate);

      const audioBase64 = `data:audio/wav;base64,${wavBuffer.toString("base64")}`;

      return NextResponse.json({ audioUrl: audioBase64 });
    } else {
      throw new Error("Failed to generate audio from API response.");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
