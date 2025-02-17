import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../login.service';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { Assignment } from '../../course';
import { AssignmentService } from '../../assignment.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { DueSoonSidebarComponent } from '../due-soon-sidebar/due-soon-sidebar.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent, FormsModule, RouterOutlet, DueSoonSidebarComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  assignmentService = inject(AssignmentService);

  courses: Course[] = [];
  assignments: Assignment[] = [];

  @Output() dueSoonAssignments = new EventEmitter<Assignment[]>();  // ✅ Output for parent component

  ngOnInit() {
    this.courseService.getCourses(this.loginService.getUserId())
      .then((courses: Course[]) => {
        this.courses = courses;
      });

    this.assignmentService.getAssignments(this.loginService.getUserId())
      .then((assignments: Assignment[]) => {
        this.assignments = assignments;
        console.log('Assignments Loaded:', this.assignments);

        const topThree = this.topThreeAssignments;
        console.log('About to emit top 3 assignments:', topThree);

        this.dueSoonAssignments.emit(topThree);
      });
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
}
