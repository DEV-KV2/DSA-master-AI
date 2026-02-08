
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.resetChat();
  }

  public resetChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  public async sendMessage(message: string, onChunk: (text: string) => void) {
    if (!this.chat) {
      this.resetChat();
    }

    try {
      const result = await this.chat!.sendMessageStream({ message });
      let fullText = '';
      
      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onChunk(fullText);
      }
      
      return fullText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
