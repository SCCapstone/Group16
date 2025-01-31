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

  // getUserInfo()
  it('should throw an error when getUserInfo response is empty ( {} )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({}),
    } as Response));

    await expectAsync(service.getUserInfo('123')).toBeRejectedWithError('userInfo is {}');
  });

  it('should throw an error when getUserInfo fetch fails', async () => {
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

  // toggleEmailNotifcations()
  it('should throw an error when tEN POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.toggleEmailNotifications('123'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when tEN fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.toggleEmailNotifications('123'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call tEN', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.toggleEmailNotifications('123'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/toggleEmailNotifications?userId=123',
    Object({ method: 'POST' }));
  });

  // toggleInstitutionEmailNotifcations
  it('should throw an error when tIEN POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.toggleInstitutionEmailNotifications('123'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when tIEN fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.toggleInstitutionEmailNotifications('123'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call tIEN', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.toggleInstitutionEmailNotifications('123'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/toggleInstitutionEmailNotifications?userId=123',
    Object({ method: 'POST' }));
  });

  // toggleSmsNotifications()
  it('should throw an error when tSN POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.toggleSmsNotifications('123'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when tSN fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.toggleSmsNotifications('123'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call tSN', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true,
    } as Response));

    await expectAsync(service.toggleSmsNotifications('123'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/toggleSmsNotifications?userId=123',
    Object({ method: 'POST' }));
  });

  // updatePreferredName()
  it('should throw an error when uPN POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.updatePreferredName('123', 'preferredName'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when uPN fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.updatePreferredName('123', 'preferredName'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call uPN', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true
    } as Response));

    await expectAsync(service.updatePreferredName('123', 'preferredName'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/updatePreferredName?userId=123&preferredName=preferredName',
    Object({ method: 'POST' }));
  });

  // updatePersonalEmail()
  it('should throw an error when uPE POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.updatePersonalEmail('123', 'personalemail@email.com'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when uPE fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.updatePersonalEmail('123', 'personalemail@email.com'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call uPE', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true
    } as Response));

    await expectAsync(service.updatePersonalEmail('123', 'personalemail@email.com'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/updateEmail?userId=123&email=personalemail%40email.com',
    Object({ method: 'POST' }));
  });

  // updatePhoneNumber()
  it('should throw an error when uPhN POST request fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.updatePhoneNumber('123', '1234567890'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when uPhN fetch encounters a network failure', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.updatePhoneNumber('123', '1234567890'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully call uPhN', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: true
    } as Response));

    await expectAsync(service.updatePhoneNumber('123', '1234567890'))
      .toBeResolved();

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/updatePhoneNumber?userId=123&phoneNumber=1234567890',
    Object({ method: 'POST' }));
  });
});
