import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'http://localhost:1616';

  constructor() { }

  async login(username: string, password: string) : Promise<User[]> {
    const data = await fetch(`${this.url}/api/login?username=${username}&password=${password}`);
    console.log(data.json());
    return await data.json() ?? {};
  }
}
