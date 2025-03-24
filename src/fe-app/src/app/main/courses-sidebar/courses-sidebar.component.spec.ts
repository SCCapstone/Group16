import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesSidebarComponent } from './courses-sidebar.component';
import { CourseService } from '../../course.service';
import { LoginService } from '../../login.service';
import { of } from 'rxjs';
import { Course } from '../../course';

describe('CoursesSidebarComponent', () => {
  let component: CoursesSidebarComponent;
  let fixture: ComponentFixture<CoursesSidebarComponent>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    // Create mock services
    courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCourses', 'deselectCourse', 'getSelectIndex', 'selectCourse']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getUserId']);

    // Mock the behavior of getCourses and getUserId
    loginServiceSpy.getUserId.and.returnValue('123'); // Simulating user ID
    courseServiceSpy.getCourses.and.returnValue(Promise.resolve([
      { id: '1', name: 'Math' },
      { id: '2', name: 'Science' }
    ] as Course[]));

    await TestBed.configureTestingModule({
      imports: [CoursesSidebarComponent],
      providers: [
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch courses on init', async () => {
    await fixture.whenStable(); // Wait for promises to resolve
    expect(component.courses.length).toBe(2);
    expect(component.courses[0].name).toBe('Math');
  });

  it('should deselect course on init', () => {
    expect(courseServiceSpy.deselectCourse).toHaveBeenCalled();
  });

  it('should select a course when clicked', () => {
    courseServiceSpy.getSelectIndex.and.returnValue(-1); // No course selected initially
    component.selectCourse(1);
    expect(courseServiceSpy.selectCourse).toHaveBeenCalledWith(1);
  });

  it('should deselect the course if the same course is clicked again', () => {
    courseServiceSpy.getSelectIndex.and.returnValue(1);
    component.selectCourse(1);
    expect(courseServiceSpy.deselectCourse).toHaveBeenCalled();
  });

  it('should return correct CSS class for selected course', () => {
    courseServiceSpy.getSelectIndex.and.returnValue(1);
    expect(component.getStyle(1)).toBe('course selected');
  });

  it('should return default CSS class for unselected course', () => {
    courseServiceSpy.getSelectIndex.and.returnValue(-1);
    expect(component.getStyle(0)).toBe('course');
  });
});
