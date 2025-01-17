import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'https://classmate.osterholt.us/api/login';
  // url = 'localhost:1616/api/login';

  private userId: string | null = null; // stores userId for use in other components

  constructor() { }

  async login(username: string, password: string) : Promise<User> {
    const response = await fetch(`${this.url}?username=${username}&password=${password}`);
    const user: Promise<User> = await response.json() ?? {};
    this.userId = (await user).id || null;
    return user;
  }

  getUserId(): string | null {
    return this.userId;
  }

  signout(): void { // to be used in signout later
    this.userId = null;
  }
}
