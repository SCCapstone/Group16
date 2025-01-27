import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutComponent } from './sign-out.component';
import { LoginService } from '../../login.service';

import { provideRouter, Router } from '@angular/router';  // Necessary to add to providers list or else NullInjectorError for ActivatedRoute
import { routes } from '../../app.routes';


// Values to use in testing
const DUMMY_USER = "osterholt";
const DUMMY_PASSWORD = "cameron1234";
const DUMMY_ID = "673fdd30cc2da4c3a3514fb7";
const USER_ID_KEY: string = "userId";

describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  // Real login service (would love to mock but it breaks tests) and mock router
  let loginService: LoginService;
  let router: Router;

  // What to do before each test is run
  beforeEach(async () => {
    
    // Add LoginService and necessary router functions to test bed, then compile it
    await TestBed.configureTestingModule({
      imports: [SignOutComponent],
      providers: [
        provideRouter(routes),
        LoginService
      ]
    })
    .compileComponents();

    // Inject LoginService into the test bed and log in "osterholt" / "cameron1234"
    loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'login').and.callThrough();
    await loginService.login(DUMMY_USER, DUMMY_PASSWORD);

    // Inject real router (will be spied on in necessary test)
    router = TestBed.inject(Router);
    
    // Fix SignOutComponent to test bed, create component instance, and watch page
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
    
    // Expect login to have been called, user ID to be non-null, and user ID from LoginService to be the same as user ID in sessionStorage
    expect(loginService.login).toHaveBeenCalledOnceWith(DUMMY_USER, DUMMY_PASSWORD);
    expect(loginService.getUserId()).toBe(DUMMY_ID);
    expect(sessionStorage.getItem(USER_ID_KEY)).toBe(DUMMY_ID);
  });


  // Sign out button should exist on page
  it('should feature a sign out button on load', () => {
    let signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    expect(signOutButton).toBeTruthy();
  });


  // Clicking sign out button should call SignOutComponent.signOut()
  it('should sign the user out when sign out button is clicked', async () => {
    
    // Install necessary spies (NOTE: installing this as a spy prevents it from being called, so testing all at once does not work)
    spyOn(component, 'signOut').and.callThrough();
    spyOn(loginService, 'signout').and.callThrough();
    spyOn(sessionStorage, 'removeItem').and.callThrough();
    
    // Find the Sign Out button and click on it
    let signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    signOutButton.click();

    // Wait for view to stabilize
    fixture.detectChanges();
    await fixture.whenStable();

    // Expect entire sign out chain to have been called and user ID in sessionStorage to be null
    expect(component.signOut).toHaveBeenCalledTimes(1);
    expect(loginService.signout).toHaveBeenCalledTimes(1);
    expect(sessionStorage.removeItem).toHaveBeenCalledOnceWith(USER_ID_KEY);
    expect(sessionStorage.getItem(USER_ID_KEY)).toBeNull();
  });


  // Clicking sign out button should route user back to home page
  it('should route to home page when sign out button is clicked', async () => {
    
    // Install spy on router.navigateByUrl without interfering with the rest of the router
    spyOn(router, 'navigateByUrl').and.stub();

    // Get button from page and click it
    let signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    signOutButton.click();
    fixture.detectChanges();

    // Expect routerLink to have been involved and the router url to now be "/" (home page)
    await fixture.whenStable();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.url).toBe("/");
  });
});
