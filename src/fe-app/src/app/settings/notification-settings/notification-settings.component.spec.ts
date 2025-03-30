import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationSettingsComponent } from './notification-settings.component';

import { UserInfo } from '../../user';
import { LoginService } from '../../login.service';
import { SettingsService } from '../../settings.service';

describe('NotificationSettingsComponent', () => {
  let component: NotificationSettingsComponent;
  let fixture: ComponentFixture<NotificationSettingsComponent>;

  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  // Returned in a promise from SettingsService.getUserInfo(); only user ID and notification settings are necessary for these tests
  const MOCK_USER_INFO: UserInfo = {
    id: "0123456789abcdef",
    name: { given: "", family: "", preferredDisplayName: "" },
    username: "",
    contact: { mobilePhone: "", email: "", institutionEmail: "" },
    settings: {
      emailNotifications: true,
      institutionEmailNotifications: false,
      smsNotifications: false
    }
  } as any;
  const MOCK_PROMISE: Promise<UserInfo> = Promise.resolve(MOCK_USER_INFO);  // Create a promise and resolve it because component constructor uses .then(...)

  beforeEach(async () => {

    // Note: object notation in createSpyObj() is similar to list but allows mock return values to be defined alongside spy object
    mockLoginService = jasmine.createSpyObj(LoginService, { getUserId: MOCK_USER_INFO.id });
    mockSettingsService = jasmine.createSpyObj(SettingsService, {
      getUserInfo: MOCK_PROMISE,
      updateNotificationSettings: undefined
    });

    await TestBed.configureTestingModule({
      imports: [NotificationSettingsComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: SettingsService, useValue: mockSettingsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component should exist
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Component instance variables should match mock properties it is loaded with once constructor finishes
  it('should use mocked values upon load', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.usePersonalEmail).toEqual(MOCK_USER_INFO.settings.emailNotifications);
    expect(component.useSchoolEmail).toEqual(MOCK_USER_INFO.settings.institutionEmailNotifications);
    expect(component.useText).toEqual(MOCK_USER_INFO.settings.smsNotifications);
  })

  // Clicking save button should call component's saveNotifications() method
  it('should call component.saveNotifications() when button is clicked', () => {
    spyOn(component, 'saveNotifications');

    const saveButton = fixture.debugElement.nativeElement.querySelector("button");
    saveButton.click();

    expect(component.saveNotifications).toHaveBeenCalledOnceWith();
  })

  // Component save method should call settings service save method with appropriate arguments
  it('should call SettingsService.updateNotificationSettings() when component.saveNotifications() is called', () => {
    component.useSchoolEmail = true;
    component.usePersonalEmail = true;
    component.useText = true;

    component.saveNotifications();

    expect(mockSettingsService.updateNotificationSettings).toHaveBeenCalledOnceWith(MOCK_USER_INFO.id, true, true, true);
  })
});
