import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component"; // Import face-api.js library

@Component({
  selector: 'app-hassan',
  templateUrl: './hassan.component.html',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  styleUrls: ['./hassan.component.scss']
})
export class HassanComponent implements OnInit {
  @ViewChild('video') videoElement!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.setupVideo();
  }

  setupVideo() {
    navigator.mediaDevices.getUserMedia({ video: true }) // Correct syntax for accessing getUserMedia
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
        this.loadModels().then(() => {
          this.startVideo();
        });
      })
      .catch((err) => console.error('Error accessing camera:', err));
  }

  async loadModels() {
    // Load face detection models from the 'hassan/models' directory
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/hassan/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/hassan/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/hassan/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/hassan/models')
    ]);
  }


  startVideo() {
    const video = this.videoElement.nativeElement;

    video.addEventListener('play', async () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
      }, 100);
    });
  }
}
