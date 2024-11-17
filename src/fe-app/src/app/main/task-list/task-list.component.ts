import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: undefined; // undefined temporary until type Task is created

  constructor() {}
  getAllTasks() {}
  filterTasks() {}
}
