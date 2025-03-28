import { Injectable } from '@angular/core';
import { Notifications } from './user';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  readonly url = 'https://classmate.osterholt.us/api/';

  constructor() { }

  async getNotifications(userId: string | null) : Promise<Notifications[]> {
    const response = await fetch(`${this.url}getNotifications?userId=${userId}`);
    const data = await response.json() ?? [];

    if(Array.isArray(data) && data.length === 0) {
      throw new Error('notifications are []');
    }

    console.log(data);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching notifications:', error.message);
    } else {
      console.error('Unexpected error', error);
    }
    throw error;
  }
}
