import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-home',
    imports: [RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  router = inject(Router);
  title = 'Home Page';
  currentValue: string = '';
  loginService = inject(LoginService);

  constructor(public activatedRoute: ActivatedRoute) {}

  /**
   * Navigates the user to the login page. Called when the "Login" button is clicked.
   */
  click() {
    this.router.navigate(['/login']);
  }
}

