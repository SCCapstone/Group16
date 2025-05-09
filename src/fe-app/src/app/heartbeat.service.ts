import { inject, Injectable, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { LoginService } from './login.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AssignmentService } from './assignment.service';

@Injectable({
  providedIn: 'root'
})
export class HeartbeatService {
  readonly url = 'https://classmate.osterholt.us/api/';
  private readonly heartbeatInterval: number = 30000;
  private readonly activityTimeout: number = 900000;
  private heartbeatTimer: any;
  private activityTimer: any;
  private currentUserId: string | null = null;
  loginService = inject(LoginService);
  assignmentService = inject(AssignmentService);
  private ngZone = inject(NgZone);
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * starts the heartbeat service once the user has logged in
   * @param userId
   */
  async startHeartbeat(userId: string) {
    if(!userId || !this.loginService.getUserId())
      return;

    if(this.heartbeatTimer && this.currentUserId === userId)
      return;

    this.currentUserId = userId;
    this.sendHeartbeat(userId);
    if (isPlatformBrowser(this.platformId)) {
      this.listenForActivity();
    }

    this.ngZone.runOutsideAngular(() => {
      this.heartbeatTimer = setInterval(() => {
        if(!this.loginService.getUserId()) {
          this.stopHeartbeat();
          return;
        }

        this.sendHeartbeat(userId);
      }, this.heartbeatInterval);
    });
  }

  /**
   * API call that sends a heartbeat to the server every 30 seconds
   * @param userId
   */
  async sendHeartbeat(userId: string): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    try {
      const response = await fetch (`${this.url}heartbeat?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending heartbeat:', error.message); // network error
      } else {
        console.error('Unexpected error', error); // unexpected error
      }
      throw error;
    }
  }

  /**
   * stops the heartbeat service once the user has logged out
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }

    this.currentUserId = null;

    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.resetActivityTimer);
      document.removeEventListener('keydown', this.resetActivityTimer);
      document.removeEventListener('click', this.resetActivityTimer);
    }

    if (isPlatformBrowser(this.platformId)) {
      console.warn('Heartbeat stopped');
    }
  }

  /**
   * resets the inactivity timer when user activity is detected
   */
  private resetActivityTimer = () => {
    clearTimeout(this.activityTimer);
    this.ngZone.runOutsideAngular(() => {
      this.activityTimer = setTimeout(() => {
        this.ngZone.run(() => {
          this.onInactivity();
        });
      }, this.activityTimeout);
    });
  };

  /**
   * listens for user activity events (mouse movement, key presses, clicks) to reset the inactivity timer
   */
  listenForActivity() {
    this.resetActivityTimer();

    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.resetActivityTimer);
      document.addEventListener('keydown', this.resetActivityTimer);
      document.addEventListener('click', this.resetActivityTimer);
    }
  }

  /**
   * handles user inactivity by logging them out and resetting the assignment service
   */
  private onInactivity() {
    console.warn('User is inactive for too long. Logging out...');
    this.loginService.signOut();
    this.assignmentService.reset();
    this.stopHeartbeat();
    this.router.navigate(['/'])
  }
}
