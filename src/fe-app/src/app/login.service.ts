import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://classmate.osterholt.us/api/login';
  // url = 'localhost:1616/api/login';

  private readonly USER_ID_KEY = 'userId'; // stores userId for use in other components

  constructor() { }

  async login(username: string, password: string) : Promise<User> {
    const response = await fetch(`${this.url}?username=${username}&password=${password}`);
    const user: Promise<User> = await response.json() ?? {};
    sessionStorage.setItem(this.USER_ID_KEY, (await user).id);
    return user;
  }

  getUserId(): string | null {
    return sessionStorage.getItem(this.USER_ID_KEY);
  }

  signout(): void { // to be used in signout later
    sessionStorage.removeItem(this.USER_ID_KEY);
  }
}
