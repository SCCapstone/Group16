import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task/task.component';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';
import { AssignmentService } from '../../assignment.service';
import { Assignment, Course } from '../../course';
import { ChangeDetectorRef} from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let assignmentServiceSpy: jasmine.SpyObj<AssignmentService>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    // Mock services
    courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCourses']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getUserId']);
    assignmentServiceSpy = jasmine.createSpyObj('AssignmentService', ['getAssignments', 'getUpdateSignal', 'toggleViewCompleted', 'getViewCompleted']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    // Mock return values
    loginServiceSpy.getUserId.and.returnValue('123'); // Simulate a user ID
    courseServiceSpy.getCourses.and.returnValue(Promise.resolve([{ id: '1', name: 'Math' }] as Course[]));
    assignmentServiceSpy.getAssignments.and.returnValue(Promise.resolve([] as Assignment[]));
    assignmentServiceSpy.getViewCompleted.and.returnValue(false);
    assignmentServiceSpy.getUpdateSignal.and.returnValue(0);

    await TestBed.configureTestingModule({
      imports: [TaskComponent, TaskListComponent],
      providers: [
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: AssignmentService, useValue: assignmentServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch courses on init', async () => {
    await fixture.whenStable(); // Wait for promises to resolve
    expect(component.courses.length).toBe(1);
    expect(component.courses[0].name).toBe('Math');
  });

  it('should load assignments on init', async () => {
    await fixture.whenStable(); // Wait for assignments to be fetched
    expect(component.assignments[0].length).toBe(0);
    expect(component.assignments[1].length).toBe(0);
  });

  it('should add a new task correctly', () => {
    const newTask: Assignment = {
      id: '123',
      userId: 'user123',
      courseId: 'course123',
      title: 'Test Assignment',
      complete: false,
      availability: { adaptiveRelease: { end: new Date('2025-12-02T00:00:00Z') } },
      userCreated: false
    };

    component.addNewTask(newTask);
    expect(component.assignments[0].length).toBe(1);
    expect(component.assignments[0][0].id).toBe('123');
    expect(cdrSpy.detectChanges).toHaveBeenCalled();
  });

  it('should remove a task when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const assignmentToRemove: Assignment = {
      id: '456',
      userId: 'user456',
      courseId: 'course456',
      title: 'Test Remove',
      complete: false,
      availability: { adaptiveRelease: { end: new Date('2025-12-02T00:00:00Z') } },
      userCreated: false
    };

    component.assignments[0].push(assignmentToRemove);
    component.onTaskRemoved('456');

    expect(component.assignments[0].length).toBe(0);
    expect(cdrSpy.detectChanges).toHaveBeenCalled();
  });

  it('should not remove a task if canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    const assignmentToRemove: Assignment = {
      id: '789',
      userId: 'user789',
      courseId: 'course789',
      title: 'Test Cancel Remove',
      complete: false,
      availability: { adaptiveRelease: { end: new Date('2025-12-02T00:00:00Z') } },
      userCreated: false
    };

    component.assignments[0].push(assignmentToRemove);
    component.onTaskRemoved('789');

    expect(component.assignments[0].length).toBe(1); // Still present
  });

  it('should update a task', () => {
    const existingAssignment: Assignment = {
      id: '101',
      userId: 'user789',
      courseId: 'course789',
      title: 'Old Assignment',
      complete: false,
      availability: { adaptiveRelease: { end: new Date('2025-12-02T00:00:00Z') } },
      userCreated: false
    };

    const updatedAssignment: Assignment = {
      ...existingAssignment,
      title: 'Updated Assignment'
    };

    component.assignments[0].push(existingAssignment);
    component.onTaskUpdated(updatedAssignment);

    expect(component.assignments[0][0].title).toBe('Updated Assignment');
    expect(cdrSpy.detectChanges).toHaveBeenCalled();
  });

  it('should return correct index based on completed view', () => {
    assignmentServiceSpy.getViewCompleted.and.returnValue(true);
    expect(component.getIndex()).toBe(1);

    assignmentServiceSpy.getViewCompleted.and.returnValue(false);
    expect(component.getIndex()).toBe(0);
  });

  it('should get correct course name by ID', () => {
    expect(component.getCourseNameByID('1')).toBe('Math');
    expect(component.getCourseNameByID('999')).toBe('Unknown');
  });

  it('should sort assignments by end date', () => {
    const task1: Assignment = {
      id: '1',
      userId: 'testUser1',
      courseId: 'testCourse1',
      title: 'test 1',
      complete: false,
      availability: { adaptiveRelease: { end: new Date('2025-12-02T00:00:00Z') } },
      userCreated: false
    };

    const task2: Assignment = {
      id: '2',
      userId: 'testUser2',
      courseId: 'testCourse2',
      title: 'test 2',
      complete: false,
      availability: { adaptiveRelease: { end: new Date('2025-12-02T00:00:00Z')  } },
      userCreated: true
    };

    component.assignments[0].push(task1, task2);
    const sortedAssignments = component.getSortedAssignments();

    expect(sortedAssignments[0].id).toBe('2'); // Task 2 should be first (earlier date)
    expect(sortedAssignments[1].id).toBe('1');
  });

  it('should toggle view completed', () => {
    component.test();
    expect(assignmentServiceSpy.toggleViewCompleted).toHaveBeenCalled();
  });
});
