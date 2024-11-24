import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'http://104.234.231.191:1616/api/login';
  // url = 'localhost:1616/api/login';

  constructor() { }

  async login(username: string, password: string) : Promise<User> {
    console.log(username)
    const data = await fetch(`${this.url}?username=${username}&password=${password}`);
    return await data.json() ?? {};
  }
}
