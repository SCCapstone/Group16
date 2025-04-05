import { Injectable } from '@angular/core';
import { UserInfo } from './user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  readonly url = 'https://classmate.osterholt.us/api/';

  constructor() { }

  /**
   * Retrieves all necessary user info for use in settings pages
   * @param userId The ID of the desired user, will typically be the user currently logged in
   * @returns User info, including settings, as a UserInfo object
   */
  async getUserInfo(userId: string | null): Promise<UserInfo> {
    try {
      const response = await fetch(`${this.url}getUser?userId=${userId}`);
      const data = await response.json() ?? {};

      if (typeof data === 'object' && Object.keys(data).length === 0)  {
        throw new Error('userInfo is {}');
      }
      
      return data;
    }
    catch (error: unknown) {
      if (error instanceof Error)
        console.error('Error fetching userInfo:', error.message);
      else
        console.error('Unexpected error', error);
  
      throw error;
    }
  }

  /**
   * Updates the preferred name of the desired user within classMATE
   * @param userId The ID of the desired user, will typically be the user currently logged in
   * @param updatedName New preferred name
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
      if(!response.ok)
        throw new Error(`POST failed: ${response.status}`);

      console.log(response);
    }
    catch (error: unknown) {
      if (error instanceof Error)
        console.error('Error updating preferred name:', error.message);
      else
        console.error('Unexpected error', error);

      throw error;
    }
  }

  /**
   * Updates the personal email of the desired user within classMATE
   * @param userId The ID of the desired user, will typically be the user currently logged in
   * @param updatedEmail New personal email
   */
  async updatePersonalEmail(userId: string | null, updatedEmail: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      email: updatedEmail ?? "NULL"
    }).toString();

    try {
      const response = await fetch (`${this.url}updateEmail?${queryParams}`, {
        method: 'POST'
      });
      if(!response.ok)
        throw new Error(`POST failed: ${response.status}`);

      console.log(response);
    }
    catch (error: unknown) {
      if (error instanceof Error)
        console.error('Error updating Email:', error.message);
      else
        console.error('Unexpected error', error);

      throw error;
    }
  }

  /**
   * Updates the phone number used for text notifications of the desired user
   * @param userId The ID of the desired user, will typically be the user currently logged in
   * @param updatedPhone New phone number
   */
  async updatePhoneNumber(userId: string | null, updatedPhone: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      phoneNumber: updatedPhone ?? "NULL"
    }).toString();

    try {
      const response = await fetch (`${this.url}updatePhoneNumber?${queryParams}`, {
        method: 'POST'
      });
      if(!response.ok)
        throw new Error(`POST failed: ${response.status}`);

      console.log(response);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating Phone Number:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }
  }

  /**
   * Updates password of the desired user, using their current password as authorization
   * @param userId The ID of the desired user, will typically be the user currently logged in
   * @param currentPassword Current password of the desired user
   * @param newPassword Updated password
   */
  async updatePassword(userId: string | null, currentPassword: string | null, newPassword: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      oldPassword: currentPassword ?? "NULL",
      newPassword: newPassword ?? "NULL"
    }).toString();

    console.log("attempting password update with values " + currentPassword + ", " + newPassword);

    try {
      const response = await fetch(`${this.url}editPassword?${queryParams}`, {
        method: 'PUT'
      });

      if(!response.ok)
        throw new Error(await response.text());
    }
    catch (error: unknown) {
      if (error instanceof Error)
        console.error('Error updating password: ', error.message);
      else
        console.error('Unexpected error', error);
      throw error;
    }
  }

  /**
   * Updates the notification settings of the desired user
   * @param userId The ID of the desired user, will typically be the user currently logged in
   * @param schoolEmail School email notifications, true if enabled
   * @param personalEmail Personal email notifications, true if enabled
   * @param sms Text notifications, true if enabled
   */
  async updateNotificationSettings(userId: string | null, schoolEmail: boolean, personalEmail: boolean, sms: boolean): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      email: String(personalEmail) ?? "NULL",
      sms: String(sms) ?? "NULL",
      institutionEmail: String(schoolEmail) ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}updateNotificationSettings?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }
      console.log(response);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating notification settings:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }
  }

  /**
   * Clears all notifications for a user
   * @param userId The ID of the desired user, will typically be the user currently logged in
   */
  async clearNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}clearNotifications?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }
      console.log(response);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error clearing notifications:', error.message);
      } else {
        console.error('Unexpected error', error);
      }
      throw error;
    }
  }
}
