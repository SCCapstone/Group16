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

  // fetchAssignments()
  it('should throw an error when fetchAssignments response is empty ( [] )', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response));

    await expectAsync(service.fetchAssignments('123')).toBeRejectedWithError('assignments are []');
  });

  it('should throw an error when fetchAssignments fetch fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.fetchAssignments('123')).toBeRejectedWithError('Network Error');
  });

  it('should successfully fetchAssignments for a user', async () => {
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
      },
      complete: false,
      userCreated: false
    }];

    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      json: () => Promise.resolve(mockAssignmentList),
    } as Response));

    const assignmentList = await service.fetchAssignments('123');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getAssignments?userId=123')
    expect(assignmentList).toEqual(mockAssignmentList);
    expect(assignmentList[0].userId).toEqual('123')
  });

  // getAssignmentById
  it('should throw an error when getAssignmentById response is empty ( {} )', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response));

    await expectAsync(service.getAssignmentById('abc')).toBeRejectedWithError('assignment is {}');
  });

  it('should throw an error when getAssignmentById fetch fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.getAssignmentById('abc')).toBeRejectedWithError('Network Error');
  });

  it('should successfully getAssignmentById for an assignmentId', async () => {
    const mockAssignment: Assignment = {
      id: 'abc',
      userId: '123',
      courseId: '456',
      title: 'testAssignment',
      description: 'unit test',
      availability: {
        adaptiveRelease: {
          end: new Date()
        }
      },
      complete: false,
      userCreated: false
    };

    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      json: () => Promise.resolve(mockAssignment),
    } as Response));

    const assignment = await service.getAssignmentById('abc');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getAssignmentById?assignmentId=abc')
    expect(assignment).toEqual(mockAssignment);
    expect(assignment.userId).toEqual('123')
  });

  // addTask()
  it('should throw an error when addTask POST request fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.addTask('Test Title', 'Test Description', new Date(), '123', '456'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when addTask fetch encounters a network failure', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.addTask('Test Title', 'Test Description', new Date(), '123', '456'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call addTask with correct parameters', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    } as Response));

    await expectAsync(service.addTask('Test Title', 'Test Description', new Date('2025-12-31'), '123', '456'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/createAssignmentWithoutId?title=Test+Title&description=Test+Description&dueDate=2025-12-31T00%3A00%3A00.000Z&userId=123&courseId=456',
    Object({ method: 'POST' }));
  });

  // editTask()
  it('should throw an error when editTask PUT request fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.editTask('Test Title', 'Test Description', new Date(), '123', '456', '789'))
      .toBeRejectedWithError('PUT failed: 500');
  });

  it('should throw an error when addTask fetch encounters a network failure', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.editTask('Test Title', 'Test Description', new Date(), '123', '456', '789'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call addTask with correct parameters', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.editTask('Test Title', 'Test Description', new Date('2025-12-31'), '123', '456', '789'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/editAssignment?userId=123&courseId=456&assignmentId=789&title=Test+Title&description=Test+Description&dueDate=2025-12-31T00%3A00%3A00.000Z',
    Object({ method: 'PUT' }));
  });

  // completeTask()
  it('should throw an error when completeTask PUT request fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.completeTask('456'))
      .toBeRejectedWithError('PUT failed: 500');
  });

  it('should throw an error when completeTask fetch encounters a network failure', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.completeTask('456'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call completeTask with correct parameters', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.completeTask('456'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/completeAssignment?assID=456',
    Object({ method: 'PUT' }));
  });

  // openTask()
  it('should throw an error when openTask PUT request fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.openTask('456'))
      .toBeRejectedWithError('PUT failed: 500');
  });

  it('should throw an error when openTask fetch encounters a network failure', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.openTask('456'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call openTask with correct parameters', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.openTask('456'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/openAssignment?assID=456',
    Object({ method: 'PUT' }));
  });

  // removeTask()
  it('should throw an error when removeTask DELETE request fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.removeTask('456'))
      .toBeRejectedWithError('DELETE failed: 500');
  });

  it('should throw an error when removeTask fetch encounters a network failure', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.removeTask('456'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call removeTask with correct parameters', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.removeTask('456'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/removeAssignment?assignmentId=456',
    Object({ method: 'DELETE' }));
  });
});
