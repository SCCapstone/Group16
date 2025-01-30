import { TestBed } from '@angular/core/testing';
import { CourseService } from './course.service';
import { Course } from './course';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error when getCourses response is empty ( [] )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response));

    await expectAsync(service.getCourses('123')).toBeRejectedWithError('courses are []');
  });

  it('should throw an error when fetch fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.getCourses('123')).toBeRejectedWithError('Network Error');
  });

  it('should successfully getCourses for a user', async () => {
    const mockCourseList: Course [] = [{
      id: 'abc',
      name: 'testCourse'
    }];

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockCourseList),
    } as Response));

    const courseList = await service.getCourses('123');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getCourses?userId=123')
    expect(courseList).toEqual(mockCourseList);
    expect(courseList[0].id).toEqual('abc');
  });

  it('should default selectIndex to -1', () => {
    expect(service.getSelectIndex()).toBe(-1);
  });

  it('should update the index if new course is selected', () => {
    service.selectCourse(1);

    expect(service.getSelectIndex()).toBe(1);
  });

  it('should set the index back to -1 deselectCourse() is called', () => {
    service.selectCourse(1);
    expect(service.getSelectIndex()).toBe(1);

    service.deselectCourse();
    expect(service.getSelectIndex()).toBe(-1);
  });

  it('should set index to -1 if same course is selected', () => {
    service.selectCourse(1);
    expect(service.getSelectIndex()).toBe(1);

    service.selectCourse(1);
    expect(service.getSelectIndex()).toBe(-1);
  });
});
