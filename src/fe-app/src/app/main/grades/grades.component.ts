import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Grade } from '../../course';
import { GradesService } from '../../grades.service';
import { LoginService } from '../../login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.css'
})
export class GradesComponent {

  // Undefined temporary until Grade and Course type are defined.
  grades: Grade[] | undefined;
  gradeService = inject(GradesService);
  loginService = inject(LoginService);
  selectedCourse: undefined;

  constructor() {
      this.gradeService.getGrades(this.loginService.getUserId())
      .then((grades: Grade[]) => {
        this.grades = grades;
      })
    }
}
