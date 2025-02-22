import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../login.service';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { Assignment } from '../../course';
import { AssignmentService } from '../../assignment.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


const ACTIVE = 0;
const COMPLETE = 1;

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent{
  @Output() dueSoonAssignments = new EventEmitter<Assignment[]>();
  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);  
  courses: Course[] = []
  assignments: Assignment[][] = [ [], [] ]  // Active, complete

  constructor(private cdr: ChangeDetectorRef) {
    console.log('dueSoonAssignments in constructor:', this.dueSoonAssignments);

    // Populate course list with service call
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    });

    // Populate assignment list with service call and filter by completion
    this.assignmentService.getAssignments(this.loginService.getUserId())
      .then((assignments: Assignment[]) => {
      this.filterAssignments(assignments);
      const sortedAssignments = this.getSortedAssignments();
      console.log('Sorted Assignments:', sortedAssignments);
      const top3Assignments = sortedAssignments.slice(0, 3);
      console.log('Top 3 Sorted Assignments:', top3Assignments);
      this.dueSoonAssignments.emit(top3Assignments);
      console.log("Sent", this.dueSoonAssignments.emit(top3Assignments));
    });
  }
  
  ngOnInit() {
    console.log('Assignments on init:', this.assignments);
  }

  test(): void {
    this.assignmentService.toggleViewCompleted();
  }

  filterAssignments(assignments: Assignment[]) {
    console.log('Assignments received for filtering:', assignments);  // Check if this logs
    for (const assignment of assignments) {
      if (assignment.complete && Date.now() >= (new Date(assignment.availability.adaptiveRelease.end)).getTime())
        this.assignments[COMPLETE].push(assignment);
      else
        this.assignments[ACTIVE].push(assignment);
    }
  }
  
  
  getSortedAssignments(): Assignment[] {
    return [...this.assignments[this.getIndex()]].sort((a, b) => 
      (new Date(a.availability.adaptiveRelease.end)).getTime() - 
      (new Date(b.availability.adaptiveRelease.end)).getTime());
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
