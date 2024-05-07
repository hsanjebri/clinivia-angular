import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { FormsModule } from "@angular/forms";
import { GemeniService } from "../gemeni.service";
import {PlatformModule} from "@angular/cdk/platform";
import { AssemblyAI } from 'assemblyai';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    PlatformModule

  ],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent implements OnInit{

  title = 'gemenie-inte';
  prompt: string = '';
  generatedText: string = ''; // Add a variable to store the generated text
  chatHistory: { from: string; message: string }[] = []; // Corrected type
  private client: AssemblyAI;
  speechSynthesis: SpeechSynthesis | null = null;

  constructor(private geminiService: GemeniService) {
    this.client = new AssemblyAI({
      apiKey: "88a29a07d26243cc8954761e92e10dbe" // Replace with your actual AssemblyAI API key
    });
    this.geminiService.getMessageHistory().subscribe((messages) => {
      if (messages) {
        this.chatHistory.push(messages); // Update the chat history
      }
    });
  }

  ngOnInit(): void {
    if (typeof window.SpeechSynthesis !== 'undefined') {
      this.speechSynthesis = window.SpeechSynthesis as unknown as SpeechSynthesis & {
        // eslint-disable-next-line @typescript-eslint/ban-types
        onvoiceschanged: Function; // Less strict type
        paused: boolean;
        pending: boolean;
        speaking: boolean;
        // ... other missing properties
      };
    } else {
      alert('Text-to-speech is not supported by your browser.');
    }
  }


  async sendData() {
    if (this.prompt) {
      console.log('Button clicked!');
      this.generatedText = await this.geminiService.generateText(this.prompt); // Store the generated text
      console.log('Button clicked!');
    }
  }
  results: string = '';

  // Event handler for starting recording when microphone icon is clicked
  startRecording() {
    console.log('Button clicked!');
    if ('webkitSpeechRecognition' in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = ['en-US', 'ar-EG']; // Include both English and Arabic
      vSearch.start();
      vSearch.onresult = (e: { results: { transcript: string; }[][]; }) => {
        console.log(e);
        this.results = e.results[0][0].transcript;
        this.prompt = this.results; // Set the speech recognition result to the input
        vSearch.stop();
      };
    } else {
      alert('Your browser does not support voice recognition!');
    }
  }

  getResult() {
    console.log(this.results);
  }
  speakText(text: string) {
    if (this.speechSynthesis && this.speechSynthesis.speak) { // Check for speak function
      const utterance = new SpeechSynthesisUtterance(text);
      this.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported by your browser.');
    }
  }

}
