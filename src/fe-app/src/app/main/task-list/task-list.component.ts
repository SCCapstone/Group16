import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../login.service';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { Assignment } from '../../course';
import { AssignmentService } from '../../assignment.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';
import { DueSoonSidebarComponent } from '../due-soon-sidebar/due-soon-sidebar.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent, FormsModule, DueSoonSidebarComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
export class TaskListComponent {


  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);

  @Output() dueSoonAssignments = new EventEmitter<Assignment[]>();  // ✅ Output for parent component
  
  courses: Course[] = []
  assignments: Assignment[][] = [ [], [] ]  // Active, complete

  test(): void {
    this.assignmentService.toggleViewCompleted();
  }

  get sortedAssignments() {
    return this.assignments.slice().sort((a, b) =>
      new Date(a.availability.adaptiveRelease.end).getTime() -
      new Date(b.availability.adaptiveRelease.end).getTime()
    );
  }

  get topThreeAssignments(): Assignment[] {
    const topThree = this.sortedAssignments.slice(0, 3);
    console.log('Top 3 Assignments:', topThree);
    return topThree;
  }

  filterAssignments(assignments: Assignment[]) {
    for (const assignment of assignments) {
      if (assignment.complete && Date.now() >= (new Date(assignment.availability.adaptiveRelease.end)).getTime())
        this.assignments[1].push(assignment)
      else
        this.assignments[0].push(assignment);
    }
  }

  getCourseNameByID(id: String): String {
    for (const course of this.courses) {
      if (course.id === id)
        return course.name
    }
    return "Unknown";
  }

  getIndex() {
    return (this.assignmentService.getViewCompleted() ? 1 : 0);
  }

}
