import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserInfo, NotificationSettings } from '../../user';
import { LoginService } from '../../login.service';
import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-notification-settings',
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.settingsService.getUserInfo(this.loginService.getUserId()).then((userInfo: UserInfo) => {
      let userSettings: NotificationSettings = userInfo.settings;
      this.useSchoolEmail = userSettings.institutionEmailNotifications;
      this.usePersonalEmail = userSettings.emailNotifications;
      this.useText = userSettings.smsNotifications;

      this.cdr.detectChanges();
    })
  }

  saveNotifications() {
    try {
      this.settingsService.updateNotificationSettings(this.loginService.getUserId(), this.useSchoolEmail, this.usePersonalEmail, this.useText);
    }
    catch (error: unknown) {
      throw error;
    }
  }
}
