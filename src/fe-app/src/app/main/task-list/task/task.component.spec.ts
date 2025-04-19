import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../../../course';
import { TaskComponent } from './task.component';
import { AssignmentService } from '../../../assignment.service';
import { CourseService } from '../../../course.service';
import { LoginService } from '../../../login.service';
import { EventEmitter } from '@angular/core';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;
  let mockCourseService: jasmine.SpyObj<CourseService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['completeTask', 'openTask', 'removeTask']);
    mockCourseService = jasmine.createSpyObj('CourseService', ['getCourse']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [TaskComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: AssignmentService, useValue: mockAssignmentService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;

    component.assignment = {
      title: 'Test Assignment',
      availability: {
        adaptiveRelease: {
          end: new Date() as Date
        }
      },
      complete: true
    } as Assignment;
    component.courseName = "CSCE 490-abc"

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle task completion', async () => {
    const assignmentId = '12345';
    component.assignment.id = assignmentId;
    component.assignment.complete = true;

    await component.toggleCompletion(component.assignment);

    expect(mockAssignmentService.openTask).toHaveBeenCalledWith(assignmentId);

    component.assignment.complete = false;

    await component.toggleCompletion(component.assignment);

    expect(mockAssignmentService.completeTask).toHaveBeenCalledWith(assignmentId);
  });

  it('should remove task', () => {
    const assignmentId = '12345';
    component.assignment.id = assignmentId;

    spyOn(component.taskRemoved, 'emit');
    component.removeTask();

    expect(mockAssignmentService.removeTask).toHaveBeenCalledWith(assignmentId);
    expect(component.taskRemoved.emit).toHaveBeenCalledWith(assignmentId);
  });

  it('should update task', () => {
    const updatedAssignment = {
      title: 'Updated Assignment'
    } as Assignment;

    spyOn(component.taskUpdated, 'emit');
    component.updateTask(updatedAssignment);

    expect(component.taskUpdated.emit).toHaveBeenCalledWith(updatedAssignment);
  });

  // Can expect remaining functions to be called correctly as they deal with the UI
});
