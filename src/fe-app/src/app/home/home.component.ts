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
  title = 'Home Page'; // Assume this will be used appropriately in future styling
  currentValue: string = ''; // is this needed?
  loginService = inject(LoginService);

  constructor(public activatedRoute: ActivatedRoute) {}

  // we can go back to routerLink in the html, but I am yet to find a good way to test it
  // we likely can expect the framework to handle routerLink properly, but discussion will be needed
  // router.navigate does do a sufficient job as well
  click() {
    this.router.navigate(['/login']);
    console.log('Button clicked');
  }


}

