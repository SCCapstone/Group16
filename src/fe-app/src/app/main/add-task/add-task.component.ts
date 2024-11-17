import { Component } from '@angular/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  name: string = "";
  type: string = "";
  course: undefined; // undefined temporary until type Course is created
  due: Date = new Date();

  constructor() {}
  addTask() {}
}
