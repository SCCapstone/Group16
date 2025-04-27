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

  canSave: boolean = true;

  @ViewChild(ProfileSettingsComponent) profileSettings!: ProfileSettingsComponent;
  @ViewChild(NotificationSettingsComponent) notificationSettings !: NotificationSettingsComponent;

  @Output() onSignout = new EventEmitter<void>(); // EventEmitter to notify parent

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Links the canSave property of the "Save Settings" button to the validity status of the form in ProfileSettings.
   * Note: ngAfterViewInit is a lifecycle hook that is called when this component is fully rendered.
   */
  ngAfterViewInit() {
    this.profileSettings.profileForm.statusChanges.subscribe(status => {
      this.canSave = (status === "VALID");
    })
  }

  /**
   * Gets the style of the text popup feedback for clicking the "Save Settings" button
   * @returns "success" if settings were saved successfully, "error" otherwise.
   */
  getMessageStyle() {
    if (this.saveSuccess)
      return "success";
    return "error";
  }

  /**
   * Attempts to save profile settings and notification settings in succession through the SettingsService is the profile settings form is valid.
   * Displays popup feedback when a response is obtained from the SettingsService.
   */
  async saveAllSettings() {
    if (!this.profileSettings.getProfileValidator())
      return

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

      this.cdr.detectChanges();
    }
  }

  handleSignout() {
    this.onSignout.emit(); // Emit event to parent component
    this.loginService.signOut();
    if (!this.loginService.getUserId()) {
      this.router.navigate(['/']);
      this.heartbeatService.stopHeartbeat();
    }
    this.assignmentService.reset();  // Reset assignment service so assignments are not transferred across logins
    }
  }
