import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert Sales Engineering Manager at a top-tier SaaS company (like Datadog, Splunk, or Vercel). 
You are interviewing a candidate for a Senior Sales Engineer role.
Your goal is to assess their technical depth, communication skills, and ability to think on their feet.

Structure of the interview:
1. Start by asking them to introduce themselves and their background.
2. Ask a technical question related to APIs, Cloud Architecture, or Debugging.
3. Ask a situational question about handling a difficult customer or a proof-of-concept failure.
4. Keep your responses concise (under 3 sentences) to keep the conversation flowing.
5. Be professional but slightly challenging.
6. If the user provides a good answer, acknowledge it briefly and move to the next topic.

Do not write out long paragraphs. Speak as if you are on a video call.
`;

export class InterviewService {
  private ai: GoogleGenAI | null = null;
  private model: string = "gemini-2.5-flash"; // Using flash for speed in chat

  constructor() {
    const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("GEMINI_API_KEY not found. AI features will be disabled. Please set GEMINI_API_KEY in .env.local");
    }
  }

  async startInterview(introMessage: string = "Hello! I'm ready for the interview."): Promise<string> {
    if (!this.ai) {
      return "Welcome! I'm ready to begin the interview. Please set your GEMINI_API_KEY in a .env.local file to enable AI features.";
    }
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: introMessage,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      return response.text || "Let's begin. Tell me about yourself.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm having trouble connecting to the evaluation server. Please check your connection.";
    }
  }

  async sendMessage(history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> {
    if (!this.ai) {
      return "AI features are disabled. Please set your GEMINI_API_KEY in a .env.local file.";
    }
    try {
       const chat = this.ai.chats.create({
        model: this.model,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        },
        history: history
       });

       const result = await chat.sendMessage({ message: newMessage });
       return result.text || "Could you clarify that?";
    } catch (error) {
       console.error("Gemini Chat Error", error);
       return "Apologies, I missed that last part. Could you repeat?";
    }
  }
}

export const interviewService = new InterviewService();