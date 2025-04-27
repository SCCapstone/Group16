import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router } from 'express';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-grade-calc',
    imports: [RouterModule, FormsModule, CommonModule],
    templateUrl: './grade-calc.component.html',
    styleUrl: './grade-calc.component.css'
})
export class GradeCalcComponent {
  assignments: { name: string; grade: number; weight: number }[] = [];

  constructor() {
    this.loadAssignments();
  }

  /**
   * Retrieves all assignments from local storage and loads them into the component
   */
  loadAssignments(): void {
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      this.assignments = JSON.parse(savedAssignments);
    } else {
      this.resetAssignments();
    }
  }

  /**
   * Saves added grades in the current session so that if the user closest and re-opens the calculator they persist
   */
  saveAssignments(): void {
    localStorage.setItem('assignments', JSON.stringify(this.assignments));
  }

  /**
   * Clears the assignment list and resets grade calculator to defaults
   */
  resetAssignments(): void {
    this.assignments = [
      { name: 'Homework', grade: 0, weight: 0 },
      { name: 'Quizzes', grade: 0, weight: 0 },
      { name: 'Midterm', grade: 0, weight: 0 },
      { name: 'Final', grade: 0, weight: 0 }
    ];
    this.saveAssignments();
  }

  /**
   * Calculates the final grade of a course using the given grades and weights
   * @returns A positive number representing the final grade as a percentage.
   */
  calculateFinalGrade(): number {
    let totalWeight = 0;
    let weightedSum = 0;
    this.assignments.forEach(assignment => {
      weightedSum += assignment.grade * assignment.weight;
      totalWeight += assignment.weight;
    });
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

}
