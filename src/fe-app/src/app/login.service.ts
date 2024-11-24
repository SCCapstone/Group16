import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'http://104.234.231.191:1616/api/login';
  // url = 'localhost:1616/api/login';

  private userId: string | null = null; // stores userId for use in other components

  constructor() { }

  async login(username: string, password: string) : Promise<User> {
    const data = await fetch(`${this.url}?username=${username}&password=${password}`);
    const user: Promise<User> = await data.json() ?? {};
    this.userId = (await user).id || null;
    return user;
  }

  getUserId(): string | null {
    console.log(this.userId) // to be removed
    return this.userId;
  }

  signout(): void { // to be used in signout later
    this.userId = null;
  }
}
