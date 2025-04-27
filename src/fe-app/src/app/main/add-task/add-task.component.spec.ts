import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AddTaskComponent } from './add-task.component';
import { AssignmentService } from '../../assignment.service';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;
  let mockCourseService: jasmine.SpyObj<CourseService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['addTask']);
    mockCourseService = jasmine.createSpyObj('CourseService', ['getCourses']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockAssignmentService.addTask.and.returnValue(Promise.resolve());
    mockCourseService.getCourses.and.returnValue(Promise.resolve([]));
    mockLoginService.getUserId.and.returnValue('12345');
    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [AddTaskComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AssignmentService, useValue: mockAssignmentService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AssignmentService.addTask when addTask() is invoked', async () => {
    component.addTaskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description',
      course: 'Test Course',
      due: new Date().toISOString(),
      time: '23:59'
    });

    await component.addTask();

    expect(mockAssignmentService.addTask).toHaveBeenCalled();
    expect(component.showPopup).toBe(false);
  });

  it('should allow a user to continue to add tasks if addMoreTasks() is called', async () => {
    spyOn(component, 'addMoreTasks').and.callThrough();

    component.addTaskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description',
      course: 'Test Course',
      due: new Date().toISOString(),
      time: '23:59'
    });

    await component.addMoreTasks();

    expect(component.addMoreTasks).toHaveBeenCalled();
    expect(mockAssignmentService.addTask).toHaveBeenCalled();
  });
});
