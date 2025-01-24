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
}
