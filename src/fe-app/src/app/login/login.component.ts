import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { User } from '../user';

@Component({
    selector: 'app-login',
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  user: User | undefined;
  loginService = inject(LoginService);
  loginForm = new FormGroup ({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  errorMessage: string | null = null;

  /**
   * Checks if a user is currently logged-in. If so, navigate them to the main page.
   * Note: ngOnInit is a lifecycle hook that is called when this component is initialized.
   */
  ngOnInit(): void {
    const userId = this.loginService.getUserId();
    if(userId) {
      this.router.navigateByUrl('/main/task-list');
    }
  }

  /**
   * Attempts to log the user in with the credentials filled out in the loginForm.
   * Displays an error on the screen if credentials are invalid or an internal server error occurs.
   */
  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'A field is blank';
      return;
    }

    this.loginService.login(
      this.loginForm.value.username ?? '',
      this.loginForm.value.password ?? ''
    )
    .then((user: User | undefined) => {
      if (user && user.id) {
        this.user = user;
        this.router.navigateByUrl("/main/task-list");
      }
    })
    .catch((error) => {
      this.errorMessage = 'Invalid login credentials';
      console.error('Login failed', error);
    });
  };
}
