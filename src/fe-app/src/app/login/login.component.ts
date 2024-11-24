import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LoginService } from '../login.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);

  user: User | undefined;
  loginService = inject(LoginService)
  loginForm = new FormGroup ({
    username: new FormControl(''),
    password: new FormControl('')
  });

  output: string | undefined = 'test';

  login() {
    this.loginService.login(
      this.loginForm.value.username ?? '',
      this.loginForm.value.password ?? ''
    )
    .then((user: User) => {
      this.user = user;
      console.log(this.user);
      this.output = this.user?.id;
    })
    .catch((error) => {
      console.error('Login failed', error);
    });
  };
}
