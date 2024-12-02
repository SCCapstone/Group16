import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications: undefined; // undefined temporary until type Notification is created

  sendNotification() {}
}
