import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { LoginService } from '../login.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['signOut', 'getUserId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
      
    };

    await TestBed.configureTestingModule({
      imports: [SettingsComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
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
    spyOn(window, 'confirm').and.returnValue(true);

    mockLoginService.signOut.and.resolveTo(); // Ensure it properly resolves
    mockRouter.navigate.and.resolveTo(true); // Ensure router.navigate doesn't stall

    await component.handleSignout();
    await fixture.whenStable(); // Wait for all async tasks

    fixture.detectChanges();

    expect(mockLoginService.signOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
});



  it('should not call loginService.signout when signout() is invoked on click', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    await component.handleSignout();

    expect(mockLoginService.signOut).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });*/
});
