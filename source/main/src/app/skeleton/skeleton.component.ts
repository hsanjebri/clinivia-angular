import { Component } from '@angular/core';
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
export class SkeletonComponent {

  title = 'gemenie-inte';
  prompt: string = '';
  generatedText: string = ''; // Add a variable to store the generated text
  chatHistory: { from: string; message: string }[] = []; // Corrected type
  private client: AssemblyAI;

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


}
