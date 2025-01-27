import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginService } from '../../login.service';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.css'
})
export class SignOutComponent
{
  loginService = inject(LoginService);

  signOut(){
    this.loginService.signout();
  }
}
