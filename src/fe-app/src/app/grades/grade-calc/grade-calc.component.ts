import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router } from 'express';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grade-calc',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './grade-calc.component.html',
  styleUrl: './grade-calc.component.css'
})
export class GradeCalcComponent {
  assignments: { name: string; grade: number; weight: number }[] = [
    { name: 'Assignment 1', grade: 0, weight: 0 },
    { name: 'Assignment 2', grade: 0, weight: 0 },
    { name: 'Assignment 3', grade: 0, weight: 0 },
    { name: 'Assignment 4', grade: 0, weight: 0 }
  ];


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
