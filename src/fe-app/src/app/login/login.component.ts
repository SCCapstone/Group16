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

  ngOnInit(): void {
    const userId = this.loginService.getUserId();
    if(userId) {
      this.router.navigateByUrl('/main/task-list');
    }
  }

  login() {
    if (this.loginForm.invalid) {
      alert('A field is blank');
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
      alert('Invalid login credentials');
      console.error('Login failed', error);
    });
  };
}
