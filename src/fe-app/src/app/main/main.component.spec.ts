import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MainComponent } from './main.component';
import { LoginService } from '../login.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [MainComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: LoginService, useValue: mockLoginService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start heartbeat on ngOnInit if userId is present', () => {
    const userId = '12345';
    mockLoginService.getUserId.and.returnValue(userId);
    const heartbeatServiceSpy = jasmine.createSpyObj('HeartbeatService', ['startHeartbeat']);
    component.heartbeatService = heartbeatServiceSpy;
    component.ngOnInit();
    expect(heartbeatServiceSpy.startHeartbeat).toHaveBeenCalledWith(userId);
  });

  it('should not start heartbeat on ngOnInit if userId is not present', () => {
    mockLoginService.getUserId.and.returnValue(null);
    const heartbeatServiceSpy = jasmine.createSpyObj('HeartbeatService', ['startHeartbeat']);
    component.heartbeatService = heartbeatServiceSpy;
    component.ngOnInit();
    expect(heartbeatServiceSpy.startHeartbeat).not.toHaveBeenCalled();
  });

  // No additional tests needed as the component is filled with other components
  // and the logic is handled in the child components.
  // We can expect UI functions and router actions to work as expected.
});
