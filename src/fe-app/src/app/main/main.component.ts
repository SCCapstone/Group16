import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  loginService = inject(LoginService);
  output: string | null = ''; // to be removed for testing only

  getUserId(): void { // function used just to test that we can access userId will be removed
    console.log(this.loginService.getUserId());
    if(this.loginService.getUserId()) {
      this.output = this.loginService.getUserId();
    }
  }

}
