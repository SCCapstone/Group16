import { Component, inject, Input, SimpleChanges, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginService } from '../../login.service';
import { Course } from '../../course';
import { CourseService } from '../../course.service';
import { Assignment } from '../../course';
import { AssignmentService } from '../../assignment.service';

import { TaskComponent } from './task/task.component';


const ACTIVE = 0;
const COMPLETE = 1;

@Component({
    selector: 'app-task-list',
    imports: [CommonModule, TaskComponent, FormsModule],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
})
export class TaskListComponent{
  @Input() newTask: Assignment | null = null;

  loginService = inject(LoginService);
  courseService = inject(CourseService);
  // assignmentService = inject(AssignmentService);
  courses: Course[] = [];
  assignments: Assignment[][] = [ [], [] ];  // Active, complete
  sortedAssignments: Assignment[] = [];

  /**
   * constructor for TaskListComponent that initializes the component and sets up the signal
   * to run whenever the AssignmentService signal updates
   * @param assignmentService
   * @param cdr
   */
  constructor(private assignmentService: AssignmentService, private cdr: ChangeDetectorRef) {
    // Set logic to run whenever the AssignmentService signal updates (e.g. its constructor finishes or an assignment is added)
    effect(() => {
      const signal = this.assignmentService.getUpdateSignal();  // Referencing the signal is necessary for it to work
      console.log("SIGNAL RUN: Value " + signal);
      this.loadAssignments();                                   // Runs when service constructor finishes, no need to call twice
    })
  }

  /**
   * ngOnInit lifecycle hook that runs when the component is initialized
   * populates the course list with a service call
   */
   async ngOnInit() {
    // Populate course list with service call
    await this.courseService.getCourses(this.loginService.getUserId())
    .then((courses: Course[]) => {
      this.courses = courses;
    });
  }

  /**
   * loadAssignments function that retrieves the assignments from the service
   * and sorts them by their end date
   */
  private async loadAssignments() {
    let retrievedAssignments = await this.assignmentService.getAssignments(this.loginService.getUserId());
    retrievedAssignments.sort((a: Assignment, b: Assignment) => {
      return new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime();
    });
    this.assignments = this.filterAssignments(retrievedAssignments);
  }

  /**
   * filterAssignments function that filters the assignments into two lists: active and complete
   * @param assignments
   */
  filterAssignments(assignments: Assignment[]) {
    let newAssignments: Assignment[][] = [ [], [] ];
    for (const assignment of assignments) {
      if (assignment.complete)
        newAssignments[COMPLETE].push(assignment);
      else
        newAssignments[ACTIVE].push(assignment);
    }
    return newAssignments;
  }

  /**
   * ngOnChanges lifecycle hook that runs when the component receives new task
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if(changes['newTask'] && this.newTask) {
      console.log('New task received:', this.newTask);
      this.addNewTask(this.newTask);
    }
  }

  /**
   * addNewTask function that adds a new task to the list of assignments
   * @param task
   */
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

  /**
   * removeTask function that removes a task from the list of assignments
   * @param id
   */
  onTaskRemoved(id: string) {
    this.assignments = this.assignments.map(list =>
      list.filter(assignment => assignment.id !== id)
    )

    this.sortedAssignments = this.getSortedAssignments();
    this.cdr.detectChanges();
  }


  /**
   * updateTask function that updates a task in the list of assignments
   * @param updatedAssignment
   */
  onTaskUpdated(updatedAssignment: Assignment) {
    this.assignments = this.assignments.map(list =>
      list.map(assignment =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );

    this.sortedAssignments = this.getSortedAssignments();
    this.cdr.detectChanges();
  }

  /**
   * toggles the view of the assignments
   */
  toggleView(): void {
    this.assignmentService.toggleViewCompleted();
  }

  /**
   * sorts the assignments by their end date
   * @returns the sorted list of assignments
   */
  getSortedAssignments(): Assignment[] {
    console.log('Sorted Assignments: ', this.assignments);
    return [...this.assignments[this.getIndex()]].sort((a, b) =>
      (new Date(a.availability.adaptiveRelease.end)).getTime() -
      (new Date(b.availability.adaptiveRelease.end)).getTime());
  }

  /**
   * gets the name of the course by its id
   * @param id
   * @returns name of the course with the given id
   */
  getCourseNameByID(id: String): String {
    for (const course of this.courses) {
      if (course.id === id)
        return course.name
    }
    return "";
  }

  /**
   * gets the index of the view completed assignments
   * @returns view completed index
   */
  getIndex() {
    return (this.assignmentService.getViewCompleted() ? 1 : 0);
  }
}
