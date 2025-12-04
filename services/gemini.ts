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
  private ai: GoogleGenAI;
  private model: string = "gemini-2.5-flash"; // Using flash for speed in chat

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async startInterview(introMessage: string = "Hello! I'm ready for the interview."): Promise<string> {
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