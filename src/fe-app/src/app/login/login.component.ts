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
  userList: User[] = [];
  loginService = inject(LoginService)
  loginForm = new FormGroup ({
    username: new FormControl(''),
    password: new FormControl('')
  });

  output: string = '';

  login() {
    this.loginService.login(
      this.loginForm.value.username ?? '',
      this.loginForm.value.password ?? ''
    ).then((userList: User[]) => {
      this.userList = userList;
    })

    this.output = this.userList[0].username;
  };
}
