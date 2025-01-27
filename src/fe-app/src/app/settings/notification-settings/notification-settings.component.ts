import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.css'
})
export class NotificationSettingsComponent {
  useSchoolEmail: boolean = false;
  usePersonalEmail: boolean = false;
  useText: boolean = false;

  constructor() {
    // TODO get settings from settings service
  }

  saveNotifications() {
    // TODO send settings to settings service
    alert(this.useSchoolEmail + " | " + this.usePersonalEmail + " | " + this.useText);
  }
}
