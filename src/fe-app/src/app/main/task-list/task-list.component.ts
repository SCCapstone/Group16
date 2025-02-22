import { Component, EventEmitter, inject, Output, OnInit, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../login.service';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { Assignment } from '../../course';
import { AssignmentService } from '../../assignment.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';
import { DueSoonSidebarComponent } from '../due-soon-sidebar/due-soon-sidebar.component';
import { ChangeDetectorRef } from '@angular/core';


const ACTIVE = 0;
const COMPLETE = 1;

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent, FormsModule, DueSoonSidebarComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent{
  @Output() dueSoonAssignments = new EventEmitter<Assignment[]>();
  @Input() newTask: Assignment | null = null;

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);
  courses: Course[] = [];
  assignments: Assignment[][] = [ [], [] ];  // Active, complete
  sortedAssignments: Assignment[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    console.log('dueSoonAssignments in constructor:', this.dueSoonAssignments);

    // Populate course list with service call
    this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    });

    // Populate assignment list with service call and filter by completion
    this.getAssignments();
  }

  private async getAssignments() {
    await this.assignmentService.getAssignments(this.loginService.getUserId())
      .then((assignments: Assignment[]) => {
        this.filterAssignments(assignments);
        this.sortedAssignments = this.getSortedAssignments();
        console.log('Sorted Assignments:', this.sortedAssignments);
        const top3Assignments = this.sortedAssignments.slice(0, 3);
        console.log('Top 3 Sorted Assignments:', top3Assignments);
        this.dueSoonAssignments.emit(top3Assignments);
        console.log("Sent", this.dueSoonAssignments.emit(top3Assignments));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['newTask'] && this.newTask) {
      console.log('New task received:', this.newTask);
      this.addNewTask(this.newTask);
    }
  }

  addNewTask (task: Assignment) {
    if (task) {
      this.assignments[ACTIVE].push(task);
      console.log('Updated assignments (ACTIVE):', this.assignments[ACTIVE]);
    }
    this.assignments = [...this.assignments];
    this.sortedAssignments = this.getSortedAssignments();
    console.log('New list: ', this.assignments)
    this.cdr.detectChanges();
  }

  onTaskRemoved(id: string) {
    this.assignments = this.assignments.map(list =>
      list.filter(assignment => assignment.id !== id)
    )

    this.sortedAssignments = this.getSortedAssignments();
    this.cdr.detectChanges();
  }

  onTaskUpdated(updatedAssignment: Assignment) {
    this.assignments = this.assignments.map(list =>
      list.map(assignment =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );

    this.sortedAssignments = this.getSortedAssignments();
    this.cdr.detectChanges();
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
    console.log('Sorted Assignments: ', this.assignments);
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
