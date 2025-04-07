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

  loadAssignments(): void {
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      this.assignments = JSON.parse(savedAssignments);
    } else {
      this.resetAssignments();
    }
  }

  saveAssignments(): void {
    localStorage.setItem('assignments', JSON.stringify(this.assignments));
  }

  resetAssignments(): void {
    this.assignments = [
      { name: 'Homework', grade: 0, weight: 0 },
      { name: 'Quizzes', grade: 0, weight: 0 },
      { name: 'Midterm', grade: 0, weight: 0 },
      { name: 'Final', grade: 0, weight: 0 }
    ];
    this.saveAssignments();
  }

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
