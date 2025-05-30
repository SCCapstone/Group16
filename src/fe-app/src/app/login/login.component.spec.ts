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
    mockLoginService = jasmine.createSpyObj('LoginService', ['login', 'getUserId']); // spy on the mock service
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']); // spy on the mock router

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

  it('should redirect to main/task-list if user is already logged in', () => {
    mockLoginService.getUserId.and.returnValue('12345');

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/main/task-list');
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: ''}); // expect the form to be empty when first opened
  });

  it('should call login() on submit button click', () => {
    spyOn(component, 'login');

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();

    fixture.detectChanges();
    expect(component.login).toHaveBeenCalled();
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
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/main/task-list'); // expect the mock router to have routed to /main
  });

  it('should not login a user when login fails', async () => { // async due to changes occurring on actual page (maybe?)
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword'}); // pass in fake invalid info
    mockLoginService.login.and.returnValue(Promise.reject('Invalid credentials')); // call the mock service and give a rejected return (why)

    await component.login(); // call the login with fake invalid info (await bc function is async)

    await fixture.isStable()
    fixture.detectChanges(); // detect the changes on the page
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled(); // expect mock router to have not been called
  });

  it('should not call loginService.login if the form is empty ', async () => { // also async due to page tracking (maybe?)
    component.loginForm.setValue({ username: '', password: ''}); // pass in no info

    await component.login(); // call login with no info (await bc function is async)

    await fixture.isStable();
    fixture.detectChanges(); // detect the changes on the page
    expect(mockLoginService.login).not.toHaveBeenCalled(); // expect the login service to not get called
  });
});
