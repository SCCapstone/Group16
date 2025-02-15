import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginService } from './login.service';

//import {HomeComponent} from './home/home.component';
import { HeartbeatService } from './heartbeat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {

  constructor(public router: Router){}

  loginService = inject(LoginService);
  heartbeatService = inject(HeartbeatService)

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

  hide(): boolean {
    const hiddenRoutes = ['/', '/login'];
    return !hiddenRoutes.includes(this.router.url);
  }


  headerRouting(): void {
    if(this.loginService.getUserId()) {
      this.router.navigate(['/main/task-list']);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    this.heartbeatService.stopHeartbeat();
  }
}
