import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { User } from './user';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);

    jest.spyOn(sessionStorage, 'setItem').mockImplementation(() => {});
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue('123');
    jest.spyOn(sessionStorage, 'removeItem').mockImplementation(() => {});

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // login()
  it('should throw an error when login POST request fails', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({
      ok: false,
      status: 500
    } as Response));

    await expectAsync(service.login('username', 'password'))
      .toBeRejectedWithError('POST failed: 500');
  });

  it('should throw an error when login fetch encounters a network failure', async () => {
    jest.spyOn(window, 'fetch').mockReturnValue(Promise.reject(new Error('Network Error')));

    await expectAsync(service.login('username', 'password'))
      .toBeRejectedWithError('Network Error');
  });

  it('should successfully log in a user', async () => {
    const mockUser: User = { id: '123'};

    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve(new Response(
      JSON.stringify(mockUser),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )))

    const user = await service.login('username', 'password');

    expect(fetchSpy).toHaveBeenCalledWith('https://classmate.osterholt.us/api/login?username=username&password=password',
    Object({ method: 'POST' }));
    expect(user).toEqual(mockUser);
    expect(sessionStorage.getItem(service['USER_ID_KEY'])).toBe('123');
  });

  // getUserId()
  it('should return user ID from session storage', () => {
    expect(service.getUserId()).toBe('123');
  });

  // signOut()
  it('should remove user ID from session storage on signout', () => {
    service.signOut();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userId');
  });
});
