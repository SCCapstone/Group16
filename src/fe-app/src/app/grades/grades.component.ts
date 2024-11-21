import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {
  
  // Undefined temporary until Grade and Course type are defined.
  grades: undefined;
  selectedCourse: undefined;
  
  constructor() {}
}
