import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { EditTaskComponent } from './edit-task.component';
import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { Assignment } from '../../course';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockCourseService: jasmine.SpyObj<CourseService>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);
    mockCourseService = jasmine.createSpyObj('CourseService', ['getCourses']);
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['getAssignments', 'editTask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockAssignmentService.editTask.and.returnValue(Promise.resolve());
    mockCourseService.getCourses.and.returnValue(Promise.resolve([]));
    mockLoginService.getUserId.and.returnValue('12345');
    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [EditTaskComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: LoginService, useValue: mockLoginService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: AssignmentService, useValue: mockAssignmentService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill the form with assignment data if assignment is provided', () => {
    const assignment = {
      title: 'Test Assignment',
      description: 'Test Description',
      courseId: '12345',
      availability: {
        adaptiveRelease: {
          end: new Date(2025, 9, 1, 12, 0)
        }
      }
    } as Assignment;

    component.assignment = assignment;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.editTaskForm.value).toEqual({
      title: 'Test Assignment',
      description: 'Test Description',
      course: '12345',
      due: '2025-10-01',
      time: '12:00'
    });
  });

  it('should call editTask() on form submission', () => {
    spyOn(component, 'editTask');

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();

    fixture.detectChanges();
    expect(component.editTask).toHaveBeenCalled();
  });
});
