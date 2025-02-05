import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserInfo, NotificationSettings } from '../../user';
import { LoginService } from '../../login.service';
import { SettingsService } from '../../settings.service';

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

  loginService = inject(LoginService);
  settingsService = inject(SettingsService);

  constructor() {
    this.settingsService.getUserInfo(this.loginService.getUserId()).then((userInfo: UserInfo) => {
      let userSettings: NotificationSettings = userInfo.settings;
      this.useSchoolEmail = userSettings.institutionEmailNotifications;
      this.usePersonalEmail = userSettings.emailNotifications;
      this.useText = userSettings.smsNotifications;
    })
  }

  async test() {
    let notificationSettings: UserInfo = await this.settingsService.getUserInfo(this.loginService.getUserId());
  }

  saveNotifications() {
    // TODO send settings to settings service
    alert(this.useSchoolEmail + " | " + this.usePersonalEmail + " | " + this.useText);
  }
}
