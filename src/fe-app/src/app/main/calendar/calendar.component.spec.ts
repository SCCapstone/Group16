import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { Assignment } from '../../course';
import { Course } from '../../course';
import { AssignmentService } from '../../assignment.service';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';


const ASSIGNMENTS: Assignment[] = [
  { id: '0', courseId: '12', availability: { adaptiveRelease: { end: new Date(2025, 3, 19) } } } as Assignment,
  { id: '1', courseId: '11', availability: { adaptiveRelease: { end: new Date(2025, 3, 18) } } } as Assignment,
  { id: '2', courseId: '11', availability: { adaptiveRelease: { end: new Date(2025, 3, 17) } } } as Assignment,
  { id: '3', courseId: '13', availability: { adaptiveRelease: { end: new Date(2025, 3, 21) } } } as Assignment,
  { id: '4', courseId: '12', availability: { adaptiveRelease: { end: new Date(2025, 3, 22, 23, 59) } } } as Assignment,
  { id: '5', courseId: '13', availability: { adaptiveRelease: { end: new Date(2025, 3, 22, 20) } } } as Assignment,
  { id: '6', courseId: '11', availability: { adaptiveRelease: { end: new Date(2025, 3, 22, 23, 59, 59) } } } as Assignment,
  { id: '7', courseId: '12', availability: { adaptiveRelease: { end: new Date(2025, 3, 25) } } } as Assignment,
  { id: '8', courseId: '12', availability: { adaptiveRelease: { end: new Date(2025, 3, 28) } } } as Assignment,
  { id: '9', courseId: '12', availability: { adaptiveRelease: { end: new Date(2025, 3, 30) } } } as Assignment,
  { id: '10', courseId: '11', availability: { adaptiveRelease: { end: new Date(2025, 4, 18) } } } as Assignment
];
const COURSES: Course[] = [
  { id: '11', name: 'Course1' },
  { id: '12', name: 'Course2'},
  { id: '13', name: 'Course3'}
];
const NOW: number = 1745362348629;  // Created on April 22, 2025, week starts April 21, 2025 and ends after April 27, 2025

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;
  let mockCourseService: jasmine.SpyObj<CourseService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['getAssignments', 'getUpdateSignal']);
    mockAssignmentService.getAssignments.and.returnValue(Promise.resolve(ASSIGNMENTS));
    mockCourseService = jasmine.createSpyObj('CourseService', ['getSelectIndex', 'getCourses']);
    mockCourseService.getCourses.and.returnValue(Promise.resolve(COURSES));
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);
    mockLoginService.getUserId.and.returnValue("mockID");
    spyOn(Date, 'now').and.returnValue(NOW);

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: AssignmentService, useValue: mockAssignmentService },
        { provide: CourseService, useValue: mockCourseService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the start of the week as midnight on Monday', () => {
    const weekStart = component.getWeekStart(new Date(NOW));
    expect(weekStart).toEqual(new Date(2025, 3, 21));
  })

  it('should retrieve a sorted list of assignments from the assignment service on initialization', () => {
    component.loadAssignments();
    expect(component.assignments).toEqual(ASSIGNMENTS.sort((a: Assignment, b: Assignment) => {
      return (a.availability.adaptiveRelease.end.getTime() <= b.availability.adaptiveRelease.end.getTime() ? -1 : 1);
    }));
  });

  it('should only include assignments from the currently-selected week in weekAssignments', () => {
    component.assignments = ASSIGNMENTS;
    component.organizeWeekAssignments();

    // Test total count of assignments in starting week
    let count = 0;
    for (const dayAssignments of component.weekAssignments) {
      for (const Assignment of dayAssignments)
        count++;
    }
    expect(count).toEqual(5);
  });

  it('should classify assignments based on due date', () => {
    component.assignments = ASSIGNMENTS;
    component.organizeWeekAssignments();
    
    // Counts of assignments within specific days
    expect(component.weekAssignments[0].length).toEqual(1);  // First day
    expect(component.weekAssignments[1].length).toEqual(3);  // A day with multiple assignments
    expect(component.weekAssignments[4].length).toEqual(1);  // A day with one assignment
    expect(component.weekAssignments[5].length).toEqual(0);  // A day with no assignments
    expect(component.weekAssignments[6].length).toEqual(0);  // Last day
  });

  it('should sort assignments by date within their day', () => {
    component.assignments = ASSIGNMENTS;
    component.organizeWeekAssignments();

    expect(component.weekAssignments[1][0].id).toEqual('5');
    expect(component.weekAssignments[1][1].id).toEqual('4');
    expect(component.weekAssignments[1][2].id).toEqual('6');
  });

  /*
  Note: removed because this is all handled within the template.
  it('should only include assignments from the currently-selected course when a course is selected', () => {
    
  });
  */

  it('should re-filter assignments and move week start forward by a week when pageForward is called', () => {
    component.assignments = ASSIGNMENTS;
    component.pageForward();

    // Total count in new week (Note: checking from 4/28 to 5/4)
    let count = 0;
    for (const dayAssignments of component.weekAssignments) {
      for (const Assignment of dayAssignments) {
        count++;
        console.log("DEBUG -- " + Assignment.id + " | " + Assignment.availability.adaptiveRelease.end)
      }
    }
    expect(count).toEqual(2);

    expect(component.weekStart).toEqual(new Date(2025, 3, 28));
  });

  it('should re-filter assignments and move week start back by a week when pageBack is called', () => {
    component.assignments = ASSIGNMENTS;
    component.pageBack();

    // Total count in new week (Note: checking from 4/14 to 4/20)
    let count = 0;
    for (const dayAssignments of component.weekAssignments) {
      for (const Assignment of dayAssignments)
        count++;
    }
    expect(count).toEqual(3);

    expect(component.weekStart).toEqual(new Date(2025, 3, 14));
  });
});
