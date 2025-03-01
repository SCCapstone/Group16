import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignOutComponent } from './sign-out.component';

import { LoginService } from '../../login.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;
  let mockLoginService: jest.Mocked<LoginService>;
  let mockRouter: jest.Mocked<Router>;

  // What to do before each test is run
  beforeEach(async () => {
    mockLoginService = {
      'signOut': jest.fn(),
      'getUserId': jest.fn()
    };
    mockRouter = {
      'navigate': jest.fn()
    };
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };

    await TestBed.configureTestingModule({
      imports: [SignOutComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    // Fix SignOutComponent to test bed, create component instance, and watch page
    fixture = TestBed.createComponent(SignOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component should exist
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Sign out button should exist on page
  it('should feature a sign out button on load', () => {
    const signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    expect(signOutButton).toBeTruthy();
  });

  it('should call signout() when the button is clicked', () => {
    jest.spyOn(component, 'handleSignout').mockImplementation(() => {});
    const button = fixture.debugElement.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(component.handleSignout).toHaveBeenCalled();
  });

  it('should call loginService.signout when signout() is invoked on click', async () => {
    mockLoginService.signOut.mockImplementation(() => {
      return Promise.resolve();
    });

    await component.handleSignout();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(mockLoginService.signOut).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
