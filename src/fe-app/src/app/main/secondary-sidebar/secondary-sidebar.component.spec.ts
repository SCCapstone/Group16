import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondarySidebarComponent } from './secondary-sidebar.component';
import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { Router } from '@angular/router';
import { Assignment, Course, Grade } from '../../course';
import assert from 'node:assert';

describe('DueSoonSidebarComponent', () => {
  let component: SecondarySidebarComponent;
  let fixture: ComponentFixture<SecondarySidebarComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockCourseService: jasmine.SpyObj<CourseService>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);
    mockCourseService = jasmine.createSpyObj('CourseService', ['getCourses', 'getSelectIndex']);
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['getAssignments', 'getUpdateSignal']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockLoginService.getUserId.and.returnValue('12345');
    mockCourseService.getCourses.and.returnValue(Promise.resolve([]));
    mockAssignmentService.getAssignments.and.returnValue(Promise.resolve([]));
    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [SecondarySidebarComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: AssignmentService, useValue: mockAssignmentService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondarySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter top three assignments', async () => {
    const mockCourses = [
      { id: 'c1', name: 'Course 1' } as Course
    ];
    const assignments = [
      { id: '1', courseId: 'c1', availability: { adaptiveRelease: { end: new Date(2025, 1, 1) } }, complete: false } as Assignment,
      { id: '2', courseId: 'c1', availability: { adaptiveRelease: { end: new Date(2025, 1, 2) } }, complete: false } as Assignment,
      { id: '3', courseId: 'c1', availability: { adaptiveRelease: { end: new Date(2025, 1, 3) } }, complete: false } as Assignment,
      { id: '4', courseId: 'c1', availability: { adaptiveRelease: { end: new Date(2025, 1, 4) } }, complete: true } as Assignment,
      { id: '5', courseId: 'c1', availability: { adaptiveRelease: { end: new Date(2025, 1, 5) } }, complete: false } as Assignment
    ];

    mockCourseService.getCourses.and.returnValue(Promise.resolve(mockCourses));
    mockCourseService.getSelectIndex.and.returnValue(0);

    await component.ngOnInit();

    component.assignments = assignments;
    component.courses = mockCourses;

    component.filterTopThree(assignments);
    expect(component.assignments.length).toBe(3);
    expect(component.assignments[0].id).toBe('1');
    expect(component.assignments[1].id).toBe('2');
    expect(component.assignments[2].id).toBe('3');
  });

  it('should calculate the final grade correctly', () => {
      const grades = [
        { id: '1', courseId: 'c1', percent: 85, gradeChar: 'A' } as Grade,
        { id: '2', courseId: 'c1', percent: 90, gradeChar: 'A' } as Grade,
        { id: '3', courseId: 'c1', percent: 78, gradeChar: 'B' } as Grade
      ];

      component.grades = grades;
      const finalGrade = component.calculateFinalGrade('c1');
      expect(finalGrade).toEqual('84.33%');
    });
});
