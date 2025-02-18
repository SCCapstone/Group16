import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SettingsService } from '../settings.service';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { UserInfo } from '../user';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ RouterOutlet, RouterModule, SettingsSidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor() {}

  userInfo: UserInfo | undefined;
  settingsService = inject(SettingsService);
  loginService = inject(LoginService);

  getInfo() {
    this.settingsService.getUserInfo(this.loginService.getUserId()).then((userInfo: UserInfo) => {
      this.userInfo = userInfo;
      console.log(this.userInfo);
    })
  }

  testPreferredNameUpdate() {
    this.settingsService.updatePreferredName(this.loginService.getUserId(), 'Cameron').then(() => {
      this.getInfo();
    });
  }
}
