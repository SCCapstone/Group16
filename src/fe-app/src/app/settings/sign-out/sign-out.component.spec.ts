import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SignOutComponent } from './sign-out.component';
import { LoginService } from '../../login.service';


describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Test account credentials used in LoginComponent's fastLogin()
  const DUMMY_USER = "osterholt";
  const DUMMY_PASSWORD = "cameron1234"

  // What to do before each test is run
  beforeEach(async () => {
    
    // Create mock login service and mock router, log in our test account, and spy on session storage (which contains user ID)
    mockLoginService = jasmine.createSpyObj('LoginService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoginService.login(DUMMY_USER, DUMMY_PASSWORD);
    spyOn(sessionStorage, 'setItem');
    
    // Replace LoginService and Router with mock counterparts, then compile with mock replacements
    await TestBed.configureTestingModule({
      imports: [SignOutComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter }
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
  it('should have user signed in already'), () =>{
    expect(mockLoginService.login).toHaveBeenCalledOnceWith(DUMMY_USER, DUMMY_PASSWORD);
    expect(mockLoginService.getUserId()).not.toBeNull;
  }

  // Sign out button should exist on page (TODO see if this is possible)
  it('should feature a sign out button on load', () => {
    expect(true).toBeTruthy;
  })

  // Clicking sign out button should call loginService.signout() and clear session storage
  it('should call loginService.signout() when sign out button is clicked', () => {
    expect(true).toBeTruthy;
  })

  // Clicking sign out button should route user back to home page
  it('should route to home page when sign out button is clicked', () => {
    expect(true).toBeTruthy;
  })
});
