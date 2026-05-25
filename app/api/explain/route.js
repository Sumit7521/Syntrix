import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prediction, confidence, topFeatures, isSafe } = body;

    // Check if API key exists
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "API key is missing. Please set GOOGLE_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Initialize Gemini Model via LangChain
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.5,
    });

    const template = `You are an expert Cybersecurity Analyst explaining a network intrusion detection system's result to a non-technical user.

The AI model has analyzed network traffic with the following results:
- Status: {isSafe}
- Predicted Threat Type: {prediction}
- Confidence Score: {confidence}%

The top features that influenced this prediction are:
{topFeatures}

Please provide a concise (max 3-4 sentences), easy-to-understand explanation of what this means.
- Avoid overly technical jargon.
- Use **bold** markdown to highlight the name of the attack and other important keywords.
- Explain *why* the system flagged it based on the top features (e.g., if 'count' is high, explain that it means too many connections).
- Give a brief actionable recommendation if it's an attack.`;

    const prompt = PromptTemplate.fromTemplate(template);
    const chain = prompt.pipe(model);

    const response = await chain.invoke({
      isSafe: isSafe ? "Safe / Normal Traffic" : "Malicious Attack",
      prediction,
      confidence: confidence,
      topFeatures: topFeatures
        .map(f => `- ${f.feature} (Impact: ${f.shap_value > 0 ? "Increased" : "Decreased"} threat probability)`)
        .join("\n")
    });

    return NextResponse.json({ explanation: response.content });

  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: error.stack || error.message || "Failed to generate explanation." },
      { status: 500 }
    );
  }
}
