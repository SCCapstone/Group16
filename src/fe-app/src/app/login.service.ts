import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from './user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly url = 'https://classmate.osterholt.us/api/';
  // url = 'localhost:1616/api/login';

  private readonly PLATFORM_ID_ = inject(PLATFORM_ID)
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
        throw new Error(`POST failed: ${response.status}`) // response error
      }

      const user: Promise<User> = await response.json() ?? {};
      sessionStorage.setItem(this.USER_ID_KEY, (await user).id);

      console.log(user);

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error logging in:', error.message); // network error
      } else {
        console.error('Unexpected error', error); // unexpected error
      }
      throw error;
    }
  }

  getUserId(): string | null {

    // I have no idea why this works
    if (isPlatformBrowser(this.PLATFORM_ID_))
      return sessionStorage.getItem(this.USER_ID_KEY);
    return null;
  }

  signOut(): void { // to be used in signout later
    sessionStorage.removeItem(this.USER_ID_KEY);
  }
}
