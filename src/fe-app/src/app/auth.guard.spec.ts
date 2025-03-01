import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginService } from './login.service';

describe('authGuard', () => {
  let mockLoginService: jest.Mocked<LoginService>;
  let mockRouter: jest.Mocked<Router>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/main' } as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockLoginService = {
      'getUserId': jest.fn()
    }; // spy on the mock service
    mockRouter = {
      'navigate': jest.fn()
    }; // spy on the mock router

    TestBed.configureTestingModule({
      providers: [
        { provide: LoginService, useValue: mockLoginService }, // replace LoginService with mockLoginService
        { provide: Router, useValue: mockRouter } // replace Router with mockRouter
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when user is logged in', () => {
    mockLoginService.getUserId.mockReturnValue('12345'); // Simulate logged-in user

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Should not redirect
  });

  it('should deny access and redirect when user is not logged in', () => {
    mockLoginService.getUserId.mockReturnValue(null); // Simulate no user logged in

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']); // Should redirect to home
  });
});
