import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

const VIEW_CALENDAR: number = 0;
const VIEW_TASK_LIST: number = 1;
const VIEW_NOTIFICATIONS: number = 2; // This will not be necessary if I can get notification overlay working

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  
  // Will be refactored with consts when I figure out how; 0 = calendar, 1 = task list, 2 = 
  viewSelect: number = 0;
}
