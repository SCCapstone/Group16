import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { UserInfo } from './user';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error when login response is empty ( {} )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({}),
    } as Response));

    await expectAsync(service.getUserInfo('123')).toBeRejectedWithError('userInfo is {}');
  });

  it('should throw an error when fetch fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.getUserInfo('123')).toBeRejectedWithError('Network Error');
  });

  it('should  successfully return userInfo with a valid userId', async () => {
    const mockUserInfo: UserInfo = {
      id: '123',
      name: {
        given: 'first',
        family: 'last',
        preferredDisplayName: 'preferred'
      },
      username: 'username',
      contact: {
        mobilePhone: 1234567890,
        email: 'testemail@email.com',
        institutionEmail: 'testiemail@email.com'
      },
      settings: {
        emailNotifications: true,
        institutionEmailNotifications: true,
        smsNotifications: false
      }
    }

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockUserInfo),
    } as Response));

    const userInfo = await service.getUserInfo('123');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/getUser?userId=123')
    expect(userInfo).toEqual(mockUserInfo);
    expect(userInfo.id).toEqual('123');
    expect(userInfo.name.family).toEqual('last');
  });
});
