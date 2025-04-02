import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginService } from './login.service';
import { NotificationsComponent } from './notifications/notifications.component';

//import {HomeComponent} from './home/home.component';
import { HeartbeatService } from './heartbeat.service';
import { SettingsComponent } from "./settings/settings.component";
import { ProfileSettingsComponent } from './settings/profile-settings/profile-settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NotificationsComponent, SettingsComponent, ProfileSettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {

  constructor(public router: Router){}

  loginService = inject(LoginService);
  heartbeatService = inject(HeartbeatService)

  title = 'fe-app';
  showPopup = false;
  popupType: string = '';

    openPopup(type: 'notifications' | 'settings') {
      this.popupType = type;
      this.showPopup = true;
      console.log("popup clicked");
      
      setTimeout(() => {
        const popup = document.querySelector(".popup-modal");
        if (popup) {
          popup.classList.add("show");
        }
      }, 10);
    }
    
    closePopup() {
      const popup = document.querySelector(".popup-modal");
      if (popup) {
        popup.classList.remove("show");
      }
    
      setTimeout(() => {
        this.showPopup = false;
      }, 400);
    }
    
  hide(): boolean {
    const hiddenRoutes = ['/', '/login', '/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/sign-out', '/grades', '/grades/grade-calc'];
    return !hiddenRoutes.includes(this.router.url);
  }

  settings(): boolean {
    const visibleRoutes = ['/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/sign-out'];
    return visibleRoutes.includes(this.router.url);
  }
  grades(): boolean {
    const visibleRoutes = ['/grades', '/grades/grade-calc'];
    return visibleRoutes.includes(this.router.url);
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
