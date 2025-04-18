import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { Assignment } from '../../course';
import { first } from 'rxjs';
import { AssignmentService } from '../../assignment.service';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockAssignmentService: jasmine.SpyObj<any>;
  let mockCourseService: jasmine.SpyObj<any>;
  let mockLoginService: jasmine.SpyObj<any>;


  beforeEach(async () => {
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['getViewCompleted', 'toggleViewCompleted', 'getAssignments', 'getUpdateSignal']);
    mockCourseService = jasmine.createSpyObj('CourseService', ['getSelectIndex', 'getCourses']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: AssignmentService, useValue: mockAssignmentService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter assignments correctly', () => {
    const assignments = [
      { id: '1', availability: { adaptiveRelease: { end: new Date(2025, 0, 2) } } } as Assignment,
      { id: '2', availability: { adaptiveRelease: { end: new Date(2025, 0, 1) } } } as Assignment
    ];
    const filteredAssignments = component.filterAssignments(assignments);
    const activeAssignments = filteredAssignments[0];
    const completeAssignments = filteredAssignments[1];

    expect(activeAssignments.length).toBe(2);
    expect(completeAssignments.length).toBe(0);
  });

  it('should sort assignments correctly', () => {
    const assignments = [
      { id: '1', availability: { adaptiveRelease: { end: new Date(2025, 0, 2) } }, complete: false } as Assignment,
      { id: '2', availability: { adaptiveRelease: { end: new Date(2025, 0, 1) } }, complete: false } as Assignment
    ];

    component.assignments[0] = assignments;
    mockAssignmentService.getViewCompleted.and.returnValue(false);

    const sorted = component.getSortedAssignments();

    expect(sorted[0].availability.adaptiveRelease.end).toEqual(new Date(2025, 0, 1));
    expect(sorted[1].availability.adaptiveRelease.end).toEqual(new Date(2025, 0, 2));
  });

  // it('should add new task correctly', async () => {
  //   const newTask = {
  //     id: '2',
  //     userId: '12345',
  //     courseId: '67890',
  //     title: 'New Task',
  //     description: 'New Task Description',
  //     availability: { adaptiveRelease: { end: new Date(2025, 0, 3) } },
  //     complete: false,
  //     userCreated: true
  //   } as Assignment;

  //   component.assignments = [[], []];

  //   mockAssignmentService.getViewCompleted.and.returnValue(false);
  //   component.addNewTask(newTask);
  //   fixture.detectChanges();

  //   expect(component.assignments[0].length).toBe(1);
  //   expect(component.assignments[0][0]).toEqual(newTask);
  // });

  it('should remove task correctly', async () => {
    const taskToRemove = { id: '1' } as Assignment;
    component.assignments[0] = [taskToRemove];

    spyOn(window, 'confirm').and.returnValue(true);
    component.onTaskRemoved(taskToRemove.id as string);

    expect(component.assignments[0].length).toBe(0);
  });

  // it('should update task correctly', () => {
  //   const taskToUpdate = { id: '1', availability: { adaptiveRelease: { end: new Date(2025, 0, 3) } }, complete: false } as Assignment;
  //   component.assignments[0] = [taskToUpdate];
  //   const updatedTask = { id: '1', availability: { adaptiveRelease: { end: new Date(2025, 0, 4) } }, complete: false } as Assignment;

  //   component.onTaskUpdated(updatedTask);

  //   expect(component.assignments[0][0].availability.adaptiveRelease.end).toEqual(new Date(2025, 0, 4));
  // });

  it('should toggle view correctly', () => {
    spyOn(component as any, 'assignmentService').and.callThrough();
    (component as any).assignmentService.getViewCompleted.and.returnValue(false);
    component.toggleView();

    expect((component as any).assignmentService.toggleViewCompleted).toHaveBeenCalled();
  });
});
