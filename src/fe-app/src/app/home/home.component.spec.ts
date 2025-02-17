import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './home.component';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should feature a to log in button on load', () => {
    const loginButton = fixture.debugElement.nativeElement.querySelector("button");
    expect(loginButton).toBeTruthy();
  });

  it('should call click() when the button is clicked', () => {
    spyOn(component, 'click').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(component.click).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'])
  });

  it('should provide the title in a <h1> tag', () => {
    const text = fixture.debugElement.nativeElement.querySelector('h1');
    expect(text.textContent).toContain('Welcome To');
  });
});
