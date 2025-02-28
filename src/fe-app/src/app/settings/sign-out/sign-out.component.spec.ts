import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignOutComponent } from './sign-out.component';

import { LoginService } from '../../login.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // What to do before each test is run
  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['signOut', 'getUserId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
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
    spyOn(component, 'handleSignout');
    const button = fixture.debugElement.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(component.handleSignout).toHaveBeenCalled();
  });

  it('should call loginService.signout when signout() is invoked on click', async () => {
    mockLoginService.signOut.and.callFake(() => {
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
