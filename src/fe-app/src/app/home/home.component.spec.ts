import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '123' : null) } },
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterModule], 
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();
    

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
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
  
});
