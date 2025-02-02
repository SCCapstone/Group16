import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Grade } from '../course';
import { GradesService } from '../grades.service';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {

  // Undefined temporary until Grade and Course type are defined.
  grades: Grade[] | undefined;
  gradeService = inject(GradesService);
  selectedCourse: undefined;

  constructor() {}
}
