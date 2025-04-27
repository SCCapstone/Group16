import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { LoginService } from '../login.service';
import { HeartbeatService } from '../heartbeat.service';
import { AssignmentService } from '../assignment.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHeartbeatService: jasmine.SpyObj<HeartbeatService>;
  let mockAssignmentService: jasmine.SpyObj<AssignmentService>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['signOut', 'getUserId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockHeartbeatService = jasmine.createSpyObj('HeartbeatService', ['stopHeartbeat']);
    mockAssignmentService = jasmine.createSpyObj('AssignmentService', ['reset']);
    const activatedRouteMock = {
      snapshot: { paramMap: {} }

    };

    await TestBed.configureTestingModule({
      imports: [SettingsComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
        { provide: HeartbeatService, useValue: mockHeartbeatService },
        { provide: AssignmentService, useValue: mockAssignmentService }
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

  it('should feature a sign out button on load', () => {
    const signOutButton = fixture.debugElement.nativeElement.querySelector("button");
    expect(signOutButton).toBeTruthy();
  });

  it('should handle signout flow correctly', async () => {
    spyOn(component.onSignout, 'emit');
    mockLoginService.getUserId.and.returnValue(null);

    await component.handleSignout();

    expect(component.onSignout.emit).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockHeartbeatService.stopHeartbeat).toHaveBeenCalled();
    expect(mockAssignmentService.reset).toHaveBeenCalled();
    expect(mockLoginService.signOut).toHaveBeenCalled();
  });
});
