import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginService } from '../login.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>; // create mock login service as LoginService
  let mockRouter: jasmine.SpyObj<Router>; // create mock router as Router

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['login']); // spy on the mock service
    mockRouter = jasmine.createSpyObj('Router', ['navigate']); // spy on the mock router

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: mockLoginService }, // replace LoginService with mockLoginService
        { provide: Router, useValue: mockRouter } // replace Router with mockRouter
      ]
    })
    .compileComponents(); // compile wih mock replacements

    fixture = TestBed.createComponent(LoginComponent); // set the fixture
    component = fixture.componentInstance; // create the instance of the component
    fixture.detectChanges(); // watch the page
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // expect the component to exist
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: ''}); // expect the form to be empty when first opened
  });

  // removed sessionStorage checks as it is now checked in login.service.spec.ts
  it('should call loginService.login when login() is invoked with valid credentials', async () => {
    // Arrange
    const mockResponse = { id: '12345'}; // mock response in form of what is promised on valid login user object
    component.loginForm.setValue({ username: 'testuser', password: 'password123' }); // pass in fake valid info
    mockLoginService.login.and.callFake(() => {
      return Promise.resolve(mockResponse);
    }); // call the mock service and give a valid return and fake call sessionStorage.setItem()

    // Act
    await component.login(); // call login with fake valid info

    // Assert

    fixture.detectChanges(); // detect the changes on the page
    expect(mockLoginService.login).toHaveBeenCalledOnceWith('testuser', 'password123'); // expect login to have been called with the same fake info
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/main']); // expect the mock router to have routed to /main
  });

  it('should set output to an error message when login fails', async () => { // async due to changes occurring on actual page (maybe?)
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword'}); // pass in fake invalid info
    mockLoginService.login.and.returnValue(Promise.reject('Invalid credentials')); // call the mock service and give a rejected return (why)

    await component.login(); // call the login with fake invalid info (await bc function is async)

    await fixture.isStable()
    fixture.detectChanges(); // detect the changes on the page
    expect(component.output).toBe('Login failed, please try again'); // expect output to have been set as intended on invalid login
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // expect mock router to have not been called
  });

  it('should not call loginService.login if the form is empty ', async () => { // also async due to page tracking (maybe?)
    component.loginForm.setValue({ username: '', password: ''}); // pass in no info

    await component.login(); // call login with no info (await bc function is async)

    await fixture.isStable();
    fixture.detectChanges(); // detect the changes on the page
    expect(mockLoginService.login).not.toHaveBeenCalled(); // expect the login service to not get called
    expect(component.output).toBe('Field is blank'); // expect output to be unchanged
  });
});
