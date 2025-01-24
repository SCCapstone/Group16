import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginService } from '../login.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(sessionStorage, 'setItem');

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: ''});
  });

  it('should call loginService.login when login() is invoked with valid credentials', () => {
    const mockResponse = { id: '12345'};
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    mockLoginService.login.and.returnValue(Promise.resolve(mockResponse));

    component.login();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(mockLoginService.login).toHaveBeenCalledOnceWith('testuser', 'password123');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('id', '12345');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/main']);
    });
  });

  it('should set output to an error message when login fails', async () => {
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword'});
    mockLoginService.login.and.returnValue(Promise.reject('Invalid credentials'));

    await component.login();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.output).toBe('Login failed, please try again');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should not call loginService.login if the form is empty ', async () => {
    component.loginForm.setValue({ username: '', password: ''});

    await component.login();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(mockLoginService.login).not.toHaveBeenCalled();
      expect(component.output).toBe('');
    })
  });
});
