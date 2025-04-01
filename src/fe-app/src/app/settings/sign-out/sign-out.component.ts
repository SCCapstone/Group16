import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from '../../login.service';
import { AssignmentService } from '../../assignment.service';
import { HeartbeatService } from '../../heartbeat.service';
import { AppComponent } from '../../app.component';


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
  heartbeatService = inject(HeartbeatService);

  //constructor(private appComponent: AppComponent) {}

  handleSignout() {

    if(confirm('Are you sure?')) {
      //this.appComponent.closePopup(); 
      this.loginService.signOut();
      if (!this.loginService.getUserId()) {
        this.router.navigate(['/']);
        this.heartbeatService.stopHeartbeat();
      }
      this.assignmentService.reset();  // Reset assignment service so assignments are not transferred across logins
    } else {
      return;
    }

  }


}
