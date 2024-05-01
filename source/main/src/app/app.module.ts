import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AngularFireAuthModule,
    AppComponent
  ],
  providers: [],
  bootstrap: []
})  
export class AppModule {

  constructor() {
    // Initialize Firebase app here
    initializeApp(environment.firebase); // Use your Firebase configuration from environment.ts
  }
}
