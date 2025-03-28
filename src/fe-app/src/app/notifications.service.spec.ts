import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import { Notifications } from './user';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getNotifications()
  it('should throw an error when getNotifications response is empty ( [] )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response));

    await expectAsync(service.getNotifications('123')).toBeRejectedWithError('notifications are []');
  });

  it('should throw an error when getGrades fetch fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.getNotifications('123')).toBeRejectedWithError('Network Error');
  });

  it('should successfully getNotifications for a user', async () => {
    const mockNotificationList: Notifications [] = [{
      id: '123',
      content: 'test'
    }];

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockNotificationList),
    } as Response));

    const notificationList = await service.getNotifications('123');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getNotifications?userId=123')
    expect(notificationList).toEqual(mockNotificationList);
    expect(notificationList[0].id).toEqual('123')
  });

});
