import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  user: User | undefined;
  loginService = inject(LoginService);
  loginForm = new FormGroup ({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  output: string | undefined = '';

  // username: osterholt; password: cameron1234
  login() {
    if (this.loginForm.invalid) {
      this.output = 'Field is blank';
     return;
    }

    this.loginService.login(
      this.loginForm.value.username ?? '',
      this.loginForm.value.password ?? ''
    )
    .then((user: User | undefined) => {
      if (user && user.id) {
        this.user = user;
        this.router.navigate(['/main']);
      }
    })
    .catch((error) => {
      this.output = 'Login failed, please try again';
      console.error('Login failed', error);
    });
  };

  // Test function to log in automatically with osterholt/cameron1234, TODO remove later
  fastLogin() {
    this.loginService.login(
      "osterholt",
      "cameron1234"
    )
    .then((user: User) => {
      if (user) {
        this.user = user;
        this.router.navigate(['/main']);
      } else {
        this.output = 'Login failed, please try again';
      }
    })
    .catch((error) => {
      this.output = 'Login failed, please try again';
      console.error('Login failed', error);
    })
  }
}
