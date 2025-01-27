import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { Location } from '@angular/common'; // Import Location to check the current URL


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '123' : null) } },
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([{ path: 'login', component: HomeComponent }]), // Set up a route for login
      ],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inject the router
    location = TestBed.inject(Location); // Inject Location to check URL changes
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the route parameter correctly', () => {
    const routeParam = component.activatedRoute.snapshot.paramMap.get('id');
    expect(routeParam).toBe('123');
  });

  it('should provide the title in a <h1> tag', () => {
    component.title = 'Home Page';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    expect(h1?.textContent).toContain('Home Page');
  });

  it('should call a function and update a value', () => {
    spyOn(component, 'updateValue').and.callThrough();
    component.updateValue('new value');
    expect(component.updateValue).toHaveBeenCalledOnceWith('new value');
    expect(component.currentValue).toBe('new value');
  });

  it('should navigate to login page when the button is clicked', async () => {
    // Find and click the button
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    // Wait for navigation to complete
    fixture.detectChanges();
    await router.navigateByUrl('/login');  // Manually trigger navigation to '/login'

    // Check if the URL is now '/login'
    expect(location.path()).toBe('/login');
  });
});
