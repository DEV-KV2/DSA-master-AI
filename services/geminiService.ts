
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    // API_KEY is provided by the environment.
    // In Vite, use import.meta.env.VITE_GEMINI_API_KEY for client-side access
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
    this.resetChat();
  }

  public resetChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more precise technical explanations
        tools: [{ googleSearch: {} }] // Enable search for latest docs/standards
      },
    });
  }

  /**
   * Sends a message to the Gemini API. 
   * Supports text and optional image input (multimodal).
   */
  public async sendMessage(
    message: string, 
    onChunk: (text: string, groundingUrls?: {title: string, uri: string}[]) => void,
    base64Image?: { data: string, mimeType: string }
  ) {
    if (!this.chat) {
      this.resetChat();
    }

    try {
      // Create parts for multimodal support
      const parts: any[] = [{ text: message }];
      if (base64Image) {
        parts.push({
          inlineData: {
            data: base64Image.data,
            mimeType: base64Image.mimeType
          }
        });
      }

      // Use sendMessageStream for a responsive UI
      // Fix: The message property in sendMessageStream expects Part | PartUnion[] (an array of parts),
      // not an object with a 'parts' key.
      const result = await this.chat!.sendMessageStream({ 
        message: base64Image ? parts : message 
      });

      let fullText = '';
      let groundingSources: {title: string, uri: string}[] = [];

      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        const chunkText = responseChunk.text || '';
        fullText += chunkText;

        // Extract grounding metadata if available (for Search)
        const chunks = responseChunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          groundingSources = chunks
            .filter(c => c.web)
            .map(c => ({ title: c.web!.title, uri: c.web!.uri }));
        }

        onChunk(fullText, groundingSources.length > 0 ? groundingSources : undefined);
      }
      
      return { text: fullText, sources: groundingSources };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
