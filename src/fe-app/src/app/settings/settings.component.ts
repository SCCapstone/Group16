import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { AppearanceSettingsComponent } from './appearance-settings/appearance-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { SignOutComponent } from './sign-out/sign-out.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    SettingsSidebarComponent,
    AppearanceSettingsComponent,
    NotificationSettingsComponent,
    ProfileSettingsComponent,
    SignOutComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor() {}
}
