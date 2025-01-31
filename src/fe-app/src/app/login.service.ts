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
    const response = await fetch(`${this.url}login?username=${username}&password=${password}`);
    const user: Promise<User> = await response.json() ?? {};

    if (typeof user === 'object' && Object.keys(user).length === 0)  {
      throw new Error('user is {}');
    }

    sessionStorage.setItem(this.USER_ID_KEY, (await user).id);
    return user;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw error;
  }

  getUserId(): string | null {
    return sessionStorage.getItem(this.USER_ID_KEY);
  }

  signOut(): void { // to be used in signout later
    sessionStorage.removeItem(this.USER_ID_KEY);
  }
}
