import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SettingsService } from '../settings.service';
import { Notifications, UserInfo } from '../user';
import { LoginService } from '../login.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  userInfo: UserInfo | null = null;
  userId: string | null = '123';
  notifications: Notifications[] = []

  constructor(private settingsService: SettingsService, private loginService: LoginService) {}

  async ngOnInit() {
      this.userId = this.loginService.getUserId();
      this.userInfo = await this.settingsService.getUserInfo(this.userId);
      this.notifications = this.userInfo.notifications;
      console.log("User Notifications:", this.userInfo.notifications);
  }

  async clearNotifications() {
    try {
      await this.settingsService.clearNotifications(this.userId);
    } catch {
      console.warn('Failed to clear Notifications');
    }

    this.notifications = [];
  }
}
