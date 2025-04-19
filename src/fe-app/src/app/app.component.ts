import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginService } from './login.service';
import { NotificationsComponent } from './notifications/notifications.component';

//import {HomeComponent} from './home/home.component';
import { HeartbeatService } from './heartbeat.service';
import { SettingsComponent } from "./settings/settings.component";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, RouterModule, NotificationsComponent, SettingsComponent],
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

  /**
   * opens a popup
   * @param type - type of popup to show
   */
  openPopup(type: 'notifications' | 'settings') {
    this.popupType = type;
    this.showPopup = true;
    console.log("popup clicked");

    document.addEventListener('keydown', this.handleEscapeKey);

    setTimeout(() => {
      const popup = document.querySelector(".popup-modal");
      if (popup) {
        popup.classList.add("show");
      }
    }, 10);
  }

  /**
   * closes the popup
   */
  closePopup() {
    const popup = document.querySelector(".popup-modal");
    if (popup) {
      popup.classList.remove("show");
    }

    document.removeEventListener('keydown', this.handleEscapeKey);

    setTimeout(() => {
      this.showPopup = false;
    }, 400);
  }

  /**
   * closes the popup when the escape key is pressed
   * @param event - the keyboard event
   */
  handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.closePopup();
    }
  }

  /**
   * closes the popup when the backdrop is clicked
   * @param event - the click event
   */
  handleBackdropClick(event: Event): void {
    this.closePopup();
  }

  /**
   * hides the header when on a hidden route
   * @returns true if the current route is not one of the hidden routes
   */
  hide(): boolean {
    const hiddenRoutes = ['/', '/login', '/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/sign-out', '/grades', '/grades/grade-calc'];
    return !hiddenRoutes.includes(this.router.url);
  }

  /**
   * checks if the current route is a settings route
   * @returns true if the current route is a settings route
   */
  settings(): boolean {
    const visibleRoutes = ['/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/sign-out'];
    return visibleRoutes.includes(this.router.url);
  }

  /**
   * checks if the current route is a grades route
   * @returns true if the current route is a grades route
   */
  grades(): boolean {
    const visibleRoutes = ['/grades', '/grades/grade-calc'];
    return visibleRoutes.includes(this.router.url);
  }

  /**
   * checks if the current route is a profile settings route
   */
  headerRouting(): void {
    if(this.loginService.getUserId()) {
      this.router.navigate(['/main/task-list']);
    } else {
      this.router.navigate(['/']);
    }
  }
  /**
   * stops the heartbeat service when the component is destroyed
   */
  ngOnDestroy() {
    this.heartbeatService.stopHeartbeat();
  }
}
