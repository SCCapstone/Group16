import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignOutComponent } from './sign-out.component';
import { LoginService } from '../../login.service';

import { provideRouter, Router } from '@angular/router';  // Necessary to add to providers list or else NullInjectorError for ActivatedRoute
import { routes } from '../../app.routes';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Test account credentials used in LoginComponent's fastLogin()
  const DUMMY_USER = "osterholt";
  const DUMMY_PASSWORD = "cameron1234"
  const USER_ID_KEY: string = "userId";  // Key that maps to user ID in sessionStorage

  // What to do before each test is run
  beforeEach(async () => {
    
    // Create mock login service and router, log in our test account
    mockLoginService = jasmine.createSpyObj('LoginService', ['login', 'getUserId', 'signout']);
    mockRouter = jasmine.createSpyObj(Router, ['navigate', 'url']);
    mockLoginService.login(DUMMY_USER, DUMMY_PASSWORD);
    
    // Replace LoginService and Router with mock counterparts, then compile with mock replacements
    await TestBed.configureTestingModule({
      imports: [SignOutComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        provideRouter([])
      ]
    })
    .compileComponents();

    // Set fix SignOutComponent to test bed, create component instance, and watch page
    fixture = TestBed.createComponent(SignOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ACTUAL TESTS START HERE

  // Component should exist
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // User should already be signed in if on this page
  it('should have user signed in already', () => {
    
    // Spy on sessionStorage's getItem function
    spyOn(sessionStorage, 'getItem');
    
    // Expect login to have been called, user ID to be non-null, and user ID from LoginService to be the same as user ID in sessionStorage
    expect(mockLoginService.login).toHaveBeenCalledOnceWith(DUMMY_USER, DUMMY_PASSWORD);
    expect(mockLoginService.getUserId()).not.toBeNull();
    expect(mockLoginService.getUserId()).toBe(sessionStorage.getItem(USER_ID_KEY));
  });

  // Sign out button should exist on page
  it('should feature a sign out button on load', () => {
    let signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    expect(signOutButton).toBeTruthy();
  });

  // Clicking sign out button should call loginService.signout() and clear session storage
  it('should sign user out when sign out button is clicked', async () => {
    
    // Install necessary spies
    spyOn(component, 'signOut');
    spyOn(sessionStorage, 'removeItem');
    
    // Find the Sign Out button and click on it
    let signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    signOutButton.click();
    fixture.detectChanges();

    // Wait for view to stabilize, then check that expected functions were called, value in sessionStorage is now null, and router is on home page
    await fixture.whenStable();
    expect(component.signOut).toHaveBeenCalledTimes(1);

    // TODO figure out why these fail, I'm losing my mind
    expect(mockLoginService.signout).toHaveBeenCalledTimes(1);
    expect(mockLoginService.getUserId()).toBeNull();
    expect(sessionStorage.removeItem).toHaveBeenCalledOnceWith(USER_ID_KEY);
  });

  // Clicking sign out button should route user back to home page
  it('should route to home page when sign out button is clicked', () => {

  });
});
