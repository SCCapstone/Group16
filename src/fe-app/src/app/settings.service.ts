import { Injectable } from '@angular/core';
import { UserInfo } from './user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly url = 'https://classmate.osterholt.us/api/';

  constructor() { }

  // potentially verify if userId matches one received
  async getUserInfo(userId: string | null): Promise<UserInfo> {
    const response = await fetch(`${this.url}getUser?userId=${userId}`);
    const data = await response.json() ?? {};

    if (typeof data === 'object' && Object.keys(data).length === 0)  {
      throw new Error('userInfo is {}');
    }

    console.log(data);
    return data;
  } catch (error: any) {
    console.error('Error fetching userInfo:', error);
    throw error;
  }

  async updateNotificationSettings(userId: string | null, email: boolean, iEmail: boolean, sms: boolean): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      email: String(email) ?? "NULL",
      sms: String(sms) ?? "NULL",
      institutionEmail: String(iEmail) ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}updateNotificationSettings?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

/*
  async toggleEmailNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}toggleEmailNotifications?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating Email Notifications:', error);
      throw error;
    }
  }

  async toggleInstitutionEmailNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}toggleInstitutionEmailNotifications?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating Institution Email Notifications:', error);
      throw error;
    }
  }

  async toggleSmsNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}toggleSmsNotifications?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating SMS Notifications:', error);
      throw error;
    }
  }
*/

  async updatePreferredName(userId: string | null, updatedName: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      preferredName: updatedName ?? "NULL"
    }).toString();

    try {
      const response = await fetch (`${this.url}updatePreferredName?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating Preferred Name:', error);
      throw error;
    }
  }

  async updatePersonalEmail(userId: string | null, updatedEmail: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      email: updatedEmail ?? "NULL"
    }).toString();

    try {
      const response = await fetch (`${this.url}updateEmail?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating Email:', error);
      throw error;
    }
  }

  async updatePhoneNumber(userId: string | null, updatedName: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      phoneNumber: updatedName ?? "NULL"
    }).toString();

    try {
      const response = await fetch (`${this.url}updatePhoneNumber?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }

      console.log(response);
    } catch (error: any) {
      console.error('Error updating Phone Number:', error);
      throw error;
    }
  }
}
