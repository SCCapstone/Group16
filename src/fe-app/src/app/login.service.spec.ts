import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { User } from './user';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);

    spyOn(sessionStorage, 'setItem');
    spyOn(sessionStorage, 'getItem').and.returnValue('123');
    spyOn(sessionStorage, 'removeItem');

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error when login response is empty ( {} )', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({}),
    } as Response));

    await expectAsync(service.login('testuser', 'password')).toBeRejectedWithError('user is {}');
  });


  it('should successfully log in a user', async () => {
    const mockUser: User = { id: '123' };

    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve(mockUser),
    } as Response));

    const user = await service.login('testuser', 'password');

    expect(user).toEqual(mockUser);
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userId', '123');
  });

  it('should return user ID from session storage', () => {
    expect(service.getUserId()).toBe('123');
  });

  it('should remove user ID from session storage on signout', () => {
    service.signOut();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userId');
  });
});
