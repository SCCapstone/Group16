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
  
  courses: Course[] = [];
  assignments: Assignment[][] = [ [], [] ];  // Active, complete
  sortedCategory: String = ""                // Category currently being sorted by -- "title", "course", or "date"
  sortedAscending: boolean = false;          // Whether the current sort is ascending or descending

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
   * loadAssignments function that retrieves the assignments from the service
   * and sorts them by their end date
   */
  private async loadAssignments() {
    let retrievedAssignments = await this.assignmentService.getAssignments(this.loginService.getUserId());
    this.assignments = this.filterAssignments(retrievedAssignments);
    this.sortByDate(true);
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
   * Sorts the assignment list alphabetically based on assignment title. Ties are sorted by due date (always ascending).
   * @param ascending True to sort in ascending order, false descending
   */
  sortByTitle(ascending: boolean) {
    let sign = 1;
    if (!ascending)
      sign = -1;
    this.assignments[ACTIVE].sort((a, b) => {
      const compareResult = a.title.localeCompare(b.title);
      if (compareResult == 0)
        return (new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime());
      return sign * compareResult;
    });
    this.assignments[COMPLETE].sort((a, b) => {
      const compareResult = a.title.localeCompare(b.title);
      if (compareResult == 0)
        return (new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime());
      return sign * compareResult;
    });
    this.sortedCategory = "title";
    this.sortedAscending = ascending;
  }

  /**
   * Sorts the assignment list based on course in the order courses appear in the course sidebar. Ties are sorted by due date (always ascending).
   * @param ascending True to sort in ascending order, false descending
   */
  sortByCourse(ascending: boolean) {
    let sign = 1;
    if (!ascending)
      sign = -1;
    this.assignments[ACTIVE].sort((a, b) => {
      const indexDifference = this.getCourseIndex(a) - this.getCourseIndex(b);
      if (indexDifference === 0)
        return (new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime());
      return sign * indexDifference;
    });
    this.assignments[COMPLETE].sort((a, b) => {
      const indexDifference = this.getCourseIndex(a) - this.getCourseIndex(b);
      if (indexDifference === 0)
        return (new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime());
      return sign * indexDifference;
    });
    this.sortedCategory = "course";
    this.sortedAscending = ascending;
  }

  /**
   * Retrieves the index of the course matching the given assignment's courseID
   * @param assignment Assignment to find the course of
   * @returns Index of the matching course in the Course array.
   */
  private getCourseIndex(assignment: Assignment) {
    for (let i=0; i < this.courses.length; i++) {
      if (this.courses[i].id === assignment.courseId)
        return i;
    }
    return -1;
  }

  /**
   * Sorts the assignment list based on date. Note: assignments are sorted by date in ascending order by default.
   * @param ascending True to sort in ascending order, false descending
   */
  sortByDate(ascending: boolean) {
    let sign = 1;
    if (!ascending)
      sign = -1;
    this.assignments[ACTIVE].sort((a, b) => {
      return sign * (new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime());
    });
    this.assignments[COMPLETE].sort((a, b) => {
      return sign * (new Date(a.availability.adaptiveRelease.end).getTime() - new Date(b.availability.adaptiveRelease.end).getTime());
    });
    this.sortedCategory = "date";
    this.sortedAscending = ascending;
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

    this.cdr.detectChanges();
  }

  /**
   * toggles the view of the assignments
   */
  toggleView(): void {
    this.assignmentService.toggleViewCompleted();
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
