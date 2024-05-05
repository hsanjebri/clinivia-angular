import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GemeniService {

  private generativeAI: GoogleGenerativeAI;
  private messageHistory: BehaviorSubject<{ from: string; message: string }> = new BehaviorSubject<any>(null); // Corrected type

  constructor() {
    this.generativeAI = new GoogleGenerativeAI('AIzaSyC-GZzgiUtaHDgniBA-G3gtQC230Vnaoag');
  }

  async generateText(prompt: string): Promise<string> {
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-pro' });
    this.messageHistory.next({
      from: 'user',
      message: prompt,
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    this.messageHistory.next({
      from: 'bot',
      message: text,
    });
    return text; // Return the generated text
  }

  getMessageHistory() {
    return this.messageHistory.asObservable();
  }
}
