import { Injectable } from '@angular/core';
import { UserInfo } from './user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  url = 'https://classmate.osterholt.us/api/';

  constructor() { }

  // potentially verify if userId matches one received
  async getUserInfo(userId: string | null): Promise<UserInfo> {
    const response = await fetch(`${this.url}getUser?userId=${userId}`);
    const data = await response.json() ?? {};
    console.log(data);
    return data;
  }

  async toggleEmailNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    console.log(queryParams);

    const response = await fetch(`${this.url}toggleEmailNotifications?${queryParams}`, {
      method: 'POST'
    });

    console.log(response)

    if(!response.ok) {
      throw new Error(`POST failed: ${response.status}`);
    }

    console.log(response);
  }

  async toggleInstitutionEmailNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    console.log(queryParams);

    const response = await fetch(`${this.url}toggleInstitutionEmailNotifications?${queryParams}`, {
      method: 'POST'
    });

    console.log(response)

    if(!response.ok) {
      throw new Error(`POST failed: ${response.status}`);
    }

    console.log(response);
  }

  async toggleSmsNotifications(userId: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL"
    }).toString();

    console.log(queryParams);

    const response = await fetch(`${this.url}toggleSmsNotifications?${queryParams}`, {
      method: 'POST'
    });

    if(!response.ok) {
      throw new Error(`POST failed: ${response.status}`);
    }

    console.log(response);
  }

  async updatePreferredName(userId: string | null, updatedName: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      preferredName: updatedName ?? "NULL"
    }).toString();

    console.log(queryParams);

    const response = await fetch (`${this.url}updatePreferredName?${queryParams}`, {
      method: 'POST'
    });

    if(!response.ok) {
      throw new Error(`POST failed: ${response.status}`);
    }

    console.log(response);
  }

  async updatePersonalEmail(userId: string | null, updatedEmail: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      email: updatedEmail ?? "NULL"
    }).toString();

    console.log(queryParams);

    const response = await fetch (`${this.url}updateEmail?${queryParams}`, {
      method: 'POST'
    });

    if(!response.ok) {
      throw new Error(`POST failed: ${response.status}`);
    }

    console.log(response);
  }

  async updatePhoneNumber(userId: string | null, updatedName: string | null): Promise<void> {
    const queryParams = new URLSearchParams({
      userId: userId ?? "NULL",
      phoneNumber: updatedName ?? "NULL"
    }).toString();

    console.log(queryParams);

    const response = await fetch (`${this.url}updatePhoneNumber?${queryParams}`, {
      method: 'POST'
    });

    if(!response.ok) {
      throw new Error(`POST failed: ${response.status}`);
    }

    console.log(response);
  }
}
