import { Component } from '@angular/core';

@Component({
  selector: 'app-grade-calculator',
  standalone: true,
  imports: [],
  templateUrl: './grade-calculator.component.html',
  styleUrl: './grade-calculator.component.css'
})
export class GradeCalculatorComponent {
  
  // Undefined temporary until Grade and Course types are added
  realGrades: undefined;
  temporaryGrades: undefined;
  selectedCourse: undefined;

  addCategory(category: string) {}
  addGrade(category: string, grade: number) {}
  calculateFinalGrade() {}
}
