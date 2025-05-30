import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from './user';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly url = 'https://classmate.osterholt.us/api/';

  private readonly PLATFORM_ID_ = inject(PLATFORM_ID)
  private readonly USER_ID_KEY = 'userId';
  private cookieName = 'auth_token';

  constructor(private cookieService: CookieService) {}

  /**
   * API call to login a user
   * @param username
   * @param password
   * @returns user object with its id
   */
  async login(username: string, password: string) : Promise<User> {
    const queryParams = new URLSearchParams({
      username: username ?? "NULL",
      password: password ?? "NULL"
    }).toString();

    try {
      const response = await fetch(`${this.url}login?${queryParams}`, {
        method: 'POST',
        credentials: 'include'
      });

      if(!response.ok) {
        const errorText = await response.text();
        throw new Error(`POST failed: ${response.status} - ${errorText}`);
      }

      const user: User = await response.json() ?? {};
      sessionStorage.setItem(this.USER_ID_KEY, user.id);

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

  /**
   * accesses the id of the user currently logged in from session storage
   * @returns the id for the user currently logged in
   */
  getUserId(): string | null {
    if (isPlatformBrowser(this.PLATFORM_ID_))
      return sessionStorage.getItem(this.USER_ID_KEY);
    return null;
  }

  /**
   * removes the user id from session storage
   */
  signOut(): void { // to be used in signout later
    sessionStorage.removeItem(this.USER_ID_KEY);
  }
}
