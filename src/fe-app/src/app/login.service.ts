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

      const user: User = await response.json() ?? {};
      sessionStorage.setItem(this.USER_ID_KEY, user.id);
      this.saveToken(user.token);

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
    if (isPlatformBrowser(this.PLATFORM_ID_))
      return sessionStorage.getItem(this.USER_ID_KEY);
    return null;
  }

  saveToken(token: string): void {
    this.cookieService.set(this.cookieName, token, {
      expires: 1,
      path: '/',
      secure: true,
      sameSite: 'Strict'
    });
  }

  getToken(): string {
    return this.cookieService.get(this.cookieName);
  }

  removeToken(): void {
    this.cookieService.delete(this.cookieName, '/');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  signOut(): void { // to be used in signout later
    sessionStorage.removeItem(this.USER_ID_KEY);
    this.removeToken();
  }
}
