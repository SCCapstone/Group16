import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../login.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../user';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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
    ).then((user: User) => {
      this.user = user;
      console.log(this.user);
      this.output = this.user?.username + ' ' + this.user?.password;
    });
  };
}
