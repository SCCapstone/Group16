import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'http://localhost:1616';

  constructor() { }

  async login(username: string, password: string) : Promise<any> {
    const data = await fetch(`${this.url}/api/login?username=${username}&password=${password}`);
    console.log(data);
    return await data.text();
  }
}
