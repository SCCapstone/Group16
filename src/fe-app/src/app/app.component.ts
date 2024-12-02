import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
//import {HomeComponent} from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fe-app';
  showPopup = false;
  popupType: 'notifications' | null = null;

  openPopup(type: 'notifications'): void {
    this.popupType = type;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
  }
}
