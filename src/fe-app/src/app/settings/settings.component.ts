import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { LoginService } from '../login.service';
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { NotificationSettingsComponent } from "./notification-settings/notification-settings.component";
import { AssignmentService } from '../assignment.service';
import { HeartbeatService } from '../heartbeat.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterOutlet, RouterModule, SettingsSidebarComponent, ProfileSettingsComponent, NotificationSettingsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor() {}

  loginService = inject(LoginService);
  router = inject(Router);
  assignmentService = inject(AssignmentService);
  heartbeatService = inject(HeartbeatService);

  @Output() onSignout = new EventEmitter<void>(); // EventEmitter to notify parent

  saveAllSettings() {
    console.log("call saveAllSettings()");
  }

  handleSignout() {
    if(confirm('Are you sure?')) {
      this.onSignout.emit(); // Emit event to parent component
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
