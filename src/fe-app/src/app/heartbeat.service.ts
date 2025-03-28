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

  async startHeartbeat(userId: string) {
    if(!userId || !this.loginService.getUserId()) {
      console.log('no userId to send');
      return;
    }

    if(this.heartbeatTimer && this.currentUserId === userId) {
      console.log('Heartbeat running for: ' + userId)
      return;
    }

    this.currentUserId = userId;
    this.sendHeartbeat(userId);
    if (isPlatformBrowser(this.platformId)) {
      this.listenForActivity();
    }
    console.log('Heartbeat started');

    this.ngZone.runOutsideAngular(() => {
      this.heartbeatTimer = setInterval(() => {
        if(!this.loginService.getUserId()) {
          console.log('user signedOut');
          this.stopHeartbeat();
          return;
        }

        this.sendHeartbeat(userId);
        //console.log('sending on timer');
      }, this.heartbeatInterval);
    });
  }

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

      //console.log(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending heartbeat:', error.message); // network error
      } else {
        console.error('Unexpected error', error); // unexpected error
      }
      throw error;
    }
  }

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
      console.log('Heartbeat stopped');
    }
  }

  private resetActivityTimer = () => {
    //console.log('Activity detected, resetting inactivity timer...');
    clearTimeout(this.activityTimer);
    this.ngZone.runOutsideAngular(() => {
      this.activityTimer = setTimeout(() => {
        this.ngZone.run(() => {
          //console.log('Activity timer expired. Logging out.');
          this.onInactivity();
        });
      }, this.activityTimeout);
      //console.log('New activity timer set:', this.activityTimer);
    });
  };

  listenForActivity() {
    console.log('Listening for user activity events.');
    this.resetActivityTimer();

    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.resetActivityTimer);
      document.addEventListener('keydown', this.resetActivityTimer);
      document.addEventListener('click', this.resetActivityTimer);
    }
  }

  private onInactivity() {
    console.log('User is inactive for too long. Logging out...');
    this.loginService.signOut();
    this.assignmentService.reset();
    this.stopHeartbeat();
    this.router.navigate(['/'])
  }
}
