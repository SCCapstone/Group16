import { Injectable } from '@angular/core';
import { UserInfo } from './user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  url = 'https://classmate.osterholt.us/api/getUser';

  constructor() { }

  async getUserInfo(userId: string | null): Promise<UserInfo> {
    const response = await fetch(`${this.url}?userId=${userId}`);
    const data = await response.json() ?? {};
    console.log(data);
    return data;
  }
}
