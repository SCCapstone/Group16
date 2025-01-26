import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '../login.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent (Behavioral)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule
      ],
      providers: [LoginService], // Use real LoginService
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear(); // Cleanup sessionStorage
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should call loginService.login and navigate on successful login', async () => {
    const loginService = TestBed.inject(LoginService); // Get the real service
    spyOn(loginService, 'login').and.returnValue(
      Promise.resolve({ id: '12345' }) // Simulate a successful login response
    );
    spyOn(sessionStorage, 'setItem');

    component.loginForm.setValue({ username: 'testuser', password: 'password123' });

    await component.login();

    expect(loginService.login).toHaveBeenCalledOnceWith('testuser', 'password123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('id', '12345');
  });

  it('should set output to an error message on failed login', async () => {
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.returnValue(Promise.reject('Invalid credentials'));

    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword' });

    await component.login();

    expect(component.output).toBe('Login failed, please try again');
  });

  it('should not call loginService.login if the form is empty', async () => {
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login');

    component.loginForm.setValue({ username: '', password: '' });

    await component.login();

    expect(loginService.login).not.toHaveBeenCalled();
    expect(component.output).toBe('');
  });
});
