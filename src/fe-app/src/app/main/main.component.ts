import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { CoursesSidebarComponent } from "../courses-sidebar/courses-sidebar.component";
import { DueSoonSidebarComponent } from '../due-soon-sidebar/due-soon-sidebar.component';


const VIEW_CALENDAR: number = 0;
const VIEW_TASK_LIST: number = 1;
const VIEW_NOTIFICATIONS: number = 2; // This will not be necessary if I can get notification overlay working

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CoursesSidebarComponent, DueSoonSidebarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  loginService = inject(LoginService);
  output: string | null = ''; // to be removed for testing only

  getUserId(): void { // function used just to test that we can access userId will be removed
    console.log(this.loginService.getUserId());
    if(this.loginService.getUserId()) {
      this.output = this.loginService.getUserId();
    }
  }
  
  // Will be refactored with consts when I figure out how; 0 = calendar, 1 = task list, 2 = 
  viewSelect: number = 0;
}
