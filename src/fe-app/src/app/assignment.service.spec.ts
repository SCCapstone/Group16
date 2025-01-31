import { TestBed } from '@angular/core/testing';
import { AssignmentService } from './assignment.service';
import { Assignment } from './course';

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getAssignments()
  it('should throw an error when getAssignments response is empty ( [] )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response));

    await expectAsync(service.getAssignments('123')).toBeRejectedWithError('assignments are []');
  });

  it('should throw an error when getAssignments fetch fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.getAssignments('123')).toBeRejectedWithError('Network Error');
  });

  it('should successfully getAssignments for a user', async () => {
    const mockAssignmentList: Assignment [] = [{
      id: 'abc',
      userId: '123',
      courseId: '456',
      title: 'testAssignment',
      description: 'unit test',
      availability: {
        adaptiveRelease: {
          end: new Date()
        }
      }
    }];

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockAssignmentList),
    } as Response));

    const assignmentList = await service.getAssignments('123');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getAssignments?userId=123')
    expect(assignmentList).toEqual(mockAssignmentList);
    expect(assignmentList[0].userId).toEqual('123')
  });

  // addTask()
  it('should throw an error when addTask POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.addTask('Test Title', 'Test Description', new Date(), '123', '456'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when addTask fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.addTask('Test Title', 'Test Description', new Date(), '123', '456'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call addTask with correct parameters', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.addTask('Test Title', 'Test Description', new Date('2025-12-31'), '123', '456'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/createAssignmentWithoutId?title=Test+Title&description=Test+Description&dueDate=2025-12-31T00%3A00%3A00.000Z&userId=123&courseId=456',
    Object({ method: 'POST' }));
  });
});
