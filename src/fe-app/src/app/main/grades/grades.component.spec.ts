import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GradesComponent } from './grades.component';
import { GradesService } from '../../grades.service';
import { LoginService } from '../../login.service';
import { CourseService } from '../../course.service';
import { AssignmentService } from '../../assignment.service';
import { Assignment, Course, Grade } from '../../course';
import { FormControl, FormGroup } from '@angular/forms';

describe('GradesComponent', () => {
  let component: GradesComponent;
  let fixture: ComponentFixture<GradesComponent>;
  let mockGradesService: jasmine.SpyObj<GradesService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockCourseService: jasmine.SpyObj<CourseService>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };

    mockGradesService = jasmine.createSpyObj('GradesService', ['getGrades', 'setGrade']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);
    mockCourseService = jasmine.createSpyObj('CourseService', ['getCourses']);
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['getAssignments']);

    mockGradesService.getGrades.and.returnValue(Promise.resolve([]));
    mockLoginService.getUserId.and.returnValue(await Promise.resolve('123'));
    mockCourseService.getCourses.and.returnValue(Promise.resolve([]));
    mockAssignmentService.getAssignments.and.returnValue(Promise.resolve([]));


    await TestBed.configureTestingModule({
      imports: [GradesComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: GradesService, useValue: mockGradesService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: AssignmentService, useValue: mockAssignmentService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCourses, getAssignments, and getGrades on init', () => {
    component.ngOnInit();

    expect(mockCourseService.getCourses).toHaveBeenCalledWith('123');
    expect(mockAssignmentService.getAssignments).toHaveBeenCalled();
    expect(mockGradesService.getGrades).toHaveBeenCalledWith('123');
  });

  it('should initialize updateGradeForm with grade controls', async () => {
    const mockGrades = [
      { id: '1', percent: 90 } as Grade,
      { id: '2', percent: -1 } as Grade
    ];

    mockGradesService.getGrades.and.returnValue(Promise.resolve(mockGrades));

    await component.ngOnInit();

    expect(component.updateGradeForm.controls['1'].value).toBe('90');
    expect(component.updateGradeForm.controls['2'].value).toBe(null);
  });

  it('should set courses, assignments, and grades on init', async () => {
    const mockCourses = [{ id: '1', name: 'Course 1' } as Course];
    const mockAssignments = [{ id: '1', title: 'Assignment 1' } as Assignment];
    const mockGrades = [{ id: '1', percent: 90 } as Grade];

    mockCourseService.getCourses.and.returnValue(Promise.resolve(mockCourses));
    mockAssignmentService.getAssignments.and.returnValue(Promise.resolve(mockAssignments));
    mockGradesService.getGrades.and.returnValue(Promise.resolve(mockGrades));

    await component.ngOnInit();

    expect(component.courses).toEqual(mockCourses);
    expect(component.assignments).toEqual(mockAssignments);
    expect(component.grades).toEqual(mockGrades);
  });

  it('should create grade controls in updateGradeForm', async () => {
    const mockGrades = [
      { id: '1', percent: 90 } as Grade,
      { id: '2', percent: -1 } as Grade
    ];

    mockGradesService.getGrades.and.returnValue(Promise.resolve(mockGrades));

    await component.ngOnInit();

    expect(component.updateGradeForm.controls['1']).toBeDefined();
    expect(component.updateGradeForm.controls['2']).toBeDefined();
  });

  it('should return course name by ID', () => {
    component.courses = [
      { id: '1', name: 'Course 1' } as Course,
      { id: '2', name: 'Course 2' } as Course
    ];

    const courseName = component.getCourseNameByID('1');
    const invalidCourseName = component.getCourseNameByID('3');

    expect(courseName).toBe('Course 1');
    expect(invalidCourseName).toBe('');
  });

  it('should return assignment title by ID', () => {
    component.assignments = [
      { id: '1', title: 'Assignment 1' } as Assignment,
      { id: '2', title: 'Assignment 2' } as Assignment
    ];

    const assignmentTitle = component.getAssignmentTitleByID('1');

    expect(assignmentTitle).toBe('Assignment 1');
  });

  it('should calculate grade char correctly', () => {
    const gradeChar = component.calculateGradeChar(95);

    expect(gradeChar).toBe('A');
  });

  it('should call GradesService.setGrade on setGrade', async () => {
    const mockGrade = { id: '1', percent: 90, assignmentId: 'a1' } as Grade;
    const mockAssignment = { id: 'a1', title: 'Assignment 1', userCreated: true } as Assignment;
    const mockPercent = 95;

    component.grades = [mockGrade];
    component.assignments = [mockAssignment];
    component.updateGradeForm = new FormGroup<{ [key: string]: FormControl<any> }>({
      '1': new FormControl(mockPercent)
    });
    mockGradesService.setGrade.and.returnValue(Promise.resolve());

    await component.setGrade(mockGrade.id);

    expect(mockGradesService.setGrade).toHaveBeenCalledWith('1', mockPercent);
  });
});
