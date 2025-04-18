import { Component, EventEmitter, inject, effect, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { LoginService } from '../login.service';
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { NotificationSettingsComponent } from "./notification-settings/notification-settings.component";
import { AssignmentService } from '../assignment.service';
import { HeartbeatService } from '../heartbeat.service';

@Component({
    selector: 'app-settings',
    imports: [RouterModule, ProfileSettingsComponent, NotificationSettingsComponent],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent {

  loginService = inject(LoginService);
  router = inject(Router);
  assignmentService = inject(AssignmentService);
  heartbeatService = inject(HeartbeatService);

  saveMessage: string = "";
  saveSuccess: boolean = false;

  @ViewChild(ProfileSettingsComponent) profileSettings!: ProfileSettingsComponent;
  @ViewChild(NotificationSettingsComponent) notificationSettings !: NotificationSettingsComponent;

  @Output() onSignout = new EventEmitter<void>(); // EventEmitter to notify parent

  constructor(private cdr: ChangeDetectorRef) {}

  getMessageStyle() {
    if (this.saveSuccess)
      return "success";
    return "error";
  }

  async saveAllSettings() {
    
    if (!this.profileSettings.getProfileValidator()) {
      this.saveMessage = "Error saving password: ensure fields are valid";
      this.saveSuccess = false;
      this.cdr.detectChanges();
      return
    }

    try {
      await this.profileSettings.saveProfile();
      await this.notificationSettings.saveNotifications();
      this.saveSuccess = true;
      this.saveMessage = "Settings saved!";
      this.cdr.detectChanges();
      setTimeout(() => {
        this.saveSuccess = false;
        this.saveMessage = "";
        this.cdr.detectChanges();
      }, 3000)
    }
    catch (error: unknown) {
      this.saveSuccess = false;
      if (error instanceof Error)
        this.saveMessage = error.message;
      else
        this.saveMessage = "Unexpected error, please try again later";
      console.log("DETECTING CHANGES");
      this.cdr.detectChanges();
    }
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
