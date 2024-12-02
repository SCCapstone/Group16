import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  name: string = "";
  type: string = "";
  course: string = "";
  // course: undefined; // TODO update type to Course when interface is created
  due: string = "";
  // due: Date = new Date();

  displayOutput: boolean = false;  // TODO for testing, remove later

  constructor() {}
  addTask() {
    this.displayOutput = true;

    // TODO Validate date and send new task to course service
  }
}
