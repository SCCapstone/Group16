import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { SettingsService } from '../settings.service';
import { LoginService } from '../login.service';
import { UserInfo } from '../user';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };
    mockSettingsService = jasmine.createSpyObj('SettingsService', ['getUserInfo', 'clearNotifications']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['getUserId']);
    mockLoginService.getUserId.and.returnValue('12345');
    mockSettingsService.getUserInfo.and.returnValue(Promise.resolve({
      id: '12345',
      notifications: [
        { message: 'Test Notification 1', timestamp: '2024-10-01T12:00:00Z' },
        { message: 'Test Notification 2', timestamp: '2024-10-01T12:00:00Z' }
      ]
    } as UserInfo));

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.notifications.length).toBe(2);
    expect(component.notifications[0].message).toBe('Test Notification 1');
  });

  it('should clear notifications when clearNotifications() is called', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    await component.clearNotifications();
    fixture.detectChanges();

    expect(mockSettingsService.clearNotifications).toHaveBeenCalled();
    expect(component.notifications.length).toBe(0);
  });
});
