import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from '../../login.service';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.css'
})
export class SignOutComponent {
  router = inject(Router);
  loginService = inject(LoginService);
  assignmentService = inject(AssignmentService);

  handleSignout() {
    if(confirm('Are you sure?')) {
      this.loginService.signOut();
      if (!this.loginService.getUserId()) {
        this.router.navigate(['/']);
      }
      this.assignmentService.reset();  // Reset assignment service so assignments are not transferred across logins
    } else {
      return;
    }
  }
}
