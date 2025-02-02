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

  setGradeTester() {
    this.gradeService.setGrade('673fdd30cc2da4c3a3514fb7', '67460db839c6b3085338aa81', '674d0d0d4b663c9b73963226', 90);
  }
}
