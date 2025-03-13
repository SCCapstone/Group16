import { inject, Injectable, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { LoginService } from './login.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

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
  private ngZone = inject(NgZone);
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.listenForActivity();
    }
  }

  async startHeartbeat(userId: string) {
    if(!userId) {
      console.log('no userId to send');
      return;
    }

    if(this.heartbeatTimer && this.currentUserId === userId) {
      console.log('Heartbeat running for: ' + userId)
      return;
    }

    this.currentUserId = userId;
    this.sendHeartbeat(userId);
    //console.log('sending first');

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

  private async sendHeartbeat(userId: string): Promise<void> {
    /*fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    }).then((response) => response.json())
    .then((data) => {
      console.log('Heartbeat sent successfully', data);
    })
    .catch((error) => {
      console.error('Heartbeat failed', error)
    })*/

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
    } catch (error: any) {
      console.error('Error sending heartbeat:', error);
      throw error;
    }
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
      this.currentUserId = null;

      if (isPlatformBrowser(this.platformId)) {
        document.removeEventListener('mousemove', this.resetActivityTimer);
        document.removeEventListener('keydown', this.resetActivityTimer);
        document.removeEventListener('click', this.resetActivityTimer);
      }
    }
  }

  private resetActivityTimer = () => {
    clearTimeout(this.activityTimer);
    this.ngZone.runOutsideAngular(() => {
      this.activityTimer = setTimeout(() => {
        this.onInactivity();
      }, this.activityTimeout)
    });
  };

  private listenForActivity() {
    this.resetActivityTimer();

    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.resetActivityTimer);
      document.addEventListener('keydown', this.resetActivityTimer);
      document.addEventListener('click', this.resetActivityTimer);
    }
  }

  private onInactivity() {
    console.log('User is inactive for too long');
    this.loginService.signOut();
    this.stopHeartbeat();
    this.router.navigate(['/'])
  }
}
