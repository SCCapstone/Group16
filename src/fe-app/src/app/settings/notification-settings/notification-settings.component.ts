import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.css'
})
export class NotificationSettingsComponent {
  schoolNotifications: boolean = false;
  personalNotifications: boolean = false;
  textNotifications: boolean = false;

  updateSettings() {}
}
