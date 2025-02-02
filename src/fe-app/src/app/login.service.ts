import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly url = 'https://classmate.osterholt.us/api/';
  // url = 'localhost:1616/api/login';

  private readonly USER_ID_KEY = 'userId'; // stores userId for use in other components

  constructor() { }

  async login(username: string, password: string) : Promise<User> {
    const queryParams = new URLSearchParams({
      username: username ?? "NULL",
      password: password ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}login?${queryParams}`, {
        method: 'POST'
      });

      if(!response.ok) {
        throw new Error(`POST failed: ${response.status}`)
      }

      const user: Promise<User> = await response.json() ?? {};
      sessionStorage.setItem(this.USER_ID_KEY, (await user).id);

      return user;
    } catch (error: any) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  getUserId(): string | null {
    return sessionStorage.getItem(this.USER_ID_KEY);
  }

  signOut(): void { // to be used in signout later
    sessionStorage.removeItem(this.USER_ID_KEY);
  }
}
