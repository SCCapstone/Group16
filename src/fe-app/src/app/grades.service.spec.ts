import { TestBed } from '@angular/core/testing';

import { GradesService } from './grades.service';
import { Grade } from './course';

describe('GradesService', () => {
  let service: GradesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getGrades()
  it('should throw an error when getGrades response is empty ( [] )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response));

    await expectAsync(service.getGrades('123')).toBeRejectedWithError('grades are []');
  });

  it('should throw an error when getGrades fetch fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.getGrades('123')).toBeRejectedWithError('Network Error');
  });

  it('should successfully getGrades for a user', async () => {
    const mockGradeList: Grade [] = [{
      id: 'abc',
      courseId: '456',
      assignmentId: '789',
      userId: '123',
      percent: 90,
      gradeChar: "A"
    }];

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockGradeList),
    } as Response));

    const gradeList = await service.getGrades('123');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getGrades?userId=123')
    expect(gradeList).toEqual(mockGradeList);
    expect(gradeList[0].userId).toEqual('123')
  });

  // setGrade()
  it('should throw an error when setGrade POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.setGrade('789', 90))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when setGrade fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.setGrade('789', 90))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call setGrade with correct parameters', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.setGrade('789', 90))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/setGrade?gradeId=789&percent=90',
    Object({ method: 'PUT' }));
  });
});
