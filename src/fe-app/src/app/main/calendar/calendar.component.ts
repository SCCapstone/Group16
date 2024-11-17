import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  tasks: undefined; // undefined temporary until type Task is created

  constructor() {}
  getAllTasks() {}
  filterTasks() {}
}
