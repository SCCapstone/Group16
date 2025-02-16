import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginService } from './login.service';

//import {HomeComponent} from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(public router: Router){}

  loginService = inject(LoginService);

  title = 'fe-app';
  showPopup = false;
  popupType: 'notifications' | null = null;

  openPopup(type: 'notifications'): void {
    this.popupType = type;
    this.showPopup = true;
    console.log("pop up clicked")
  }

  closePopup(): void {
    this.showPopup = false;
    this.popupType = null;
  }

  hide(): boolean {
    const hiddenRoutes = ['/', '/login', '/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/sign-out', '/grades', '/grades/grade-calc'];
    return !hiddenRoutes.includes(this.router.url);
  }

  settings(): boolean {
    const visibleRoutes = ['/settings/profile', '/settings/appearance', '/settings/notifications', '/settings/sign-out'];
    return visibleRoutes.includes(this.router.url);
  }
  grades(): boolean {
    const visibleRoutes = ['/grades', '/grades/grade-calc'];
    return visibleRoutes.includes(this.router.url);
  }
  
  headerRouting(): void {
    if(this.loginService.getUserId()) {
      this.router.navigate(['/main/task-list']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
