import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutComponent } from './sign-out.component';
import { LoginService } from '../../login.service';

import { provideRouter } from '@angular/router';  // Necessary to add to providers list or else NullInjectorError for ActivatedRoute
import { routes } from '../../app.routes';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  let mockLoginService: jasmine.SpyObj<LoginService>;

  // Test account credentials used in LoginComponent's fastLogin()
  const DUMMY_USER = "osterholt";
  const DUMMY_PASSWORD = "cameron1234"
  const USER_ID_KEY: string = "userId";  // Key that maps to user ID in sessionStorage

  // What to do before each test is run
  beforeEach(async () => {
    
    // Create mock login service, log in our test account, and spy on session storage (which contains user ID)
    mockLoginService = jasmine.createSpyObj('LoginService', ['login', 'getUserId', 'signout']);
    mockLoginService.login(DUMMY_USER, DUMMY_PASSWORD);
    spyOn(sessionStorage, 'getItem');
    
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
    expect(mockLoginService.login).toHaveBeenCalledOnceWith(DUMMY_USER, DUMMY_PASSWORD);
    expect(mockLoginService.getUserId()).not.toBeNull();
    expect(mockLoginService.getUserId()).toBe(sessionStorage.getItem(USER_ID_KEY));
  });

  // Sign out button should exist on page
  it('should feature a sign out button on load', () => {

  })

  // Clicking sign out button should call loginService.signout() and clear session storage
  it('should call loginService.signout() when sign out button is clicked', () => {

  })

  // Clicking sign out button should route user back to home page
  it('should route to home page when sign out button is clicked', () => {

  })
});
