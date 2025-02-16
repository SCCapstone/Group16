import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';

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

  constructor() {
    this.listenForActivity();
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
    console.log('sending first');

    this.heartbeatTimer = setInterval(() => {
      if(!this.loginService.getUserId()) {
        console.log('user signedOut');
        this.stopHeartbeat();
        return;
      }

      this.sendHeartbeat(userId);
      console.log('sending on timer');
    }, this.heartbeatInterval);
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

      console.log(response);
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
    }
  }

  private listenForActivity() {
    const resetActivityTimer = () => {
      clearTimeout(this.activityTimer);
      this.activityTimer = setTimeout(() => {
        this.onInactivity();
      }, this.activityTimeout)
    };

    //document.addEventListener('mousemove', resetActivityTimer);
    //document.addEventListener('keydown', resetActivityTimer);
    //document.addEventListener('click', resetActivityTimer);
  }

  private onInactivity() {
    console.log('User is inactive for too long');
    this.loginService.signOut();
    this.stopHeartbeat();
  }
}
