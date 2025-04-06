import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSettingsComponent } from './profile-settings.component';

import { UserInfo } from '../../user';
import { LoginService } from '../../login.service';
import { SettingsService } from '../../settings.service';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;

  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  // Returned in a promise from SettingsService.getUserInfo(); only user ID and profile settings are necessary for these tests
  const MOCK_USER_INFO: UserInfo = {
    id: "0123456789abcdef",
    name: {
      given: "Michael",
      family: "Pikula",
      preferredDisplayName: "Mike"
    },
    username: "",
    contact: {
      mobilePhone: "0123456789",
      email: "michael@gmail.com",
      institutionEmail: "michael@sc.edu"
    },
    settings: { emailNotifications: false, institutionEmailNotifications: false, smsNotifications: false }
  } as any;
  const MOCK_PROMISE: Promise<UserInfo> = Promise.resolve(MOCK_USER_INFO);  // Create a promise and resolve it because component constructor uses .then(...)
  const MOCK_PHONE_AUGMENTED = "012-345-6789"

  beforeEach(async () => {

    // Note: object notation in createSpyObj() is similar to list but allows mock return values to be defined alongside spy object
    mockLoginService = jasmine.createSpyObj(LoginService, { getUserId: MOCK_USER_INFO.id });
    mockSettingsService = jasmine.createSpyObj(SettingsService, {
      getUserInfo: MOCK_PROMISE,
      updatePreferredName: undefined,
      updatePersonalEmail: undefined,
      updatePhoneNumber: undefined
    });

    await TestBed.configureTestingModule({
      imports: [ProfileSettingsComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: SettingsService, useValue: mockSettingsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsComponent);
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

    expect(component.preferredName).toEqual(MOCK_USER_INFO.name.preferredDisplayName);
    expect(component.schoolEmail).toEqual(MOCK_USER_INFO.contact.institutionEmail);
    expect(component.personalEmail).toEqual(MOCK_USER_INFO.contact.email);
    expect(component.phoneNumber).toEqual(MOCK_PHONE_AUGMENTED);
  })

  /*
  // Clicking save button should call component's saveProfile() method
  it('should call component.saveProfile() when button is clicked', async () => {
    spyOn(component, 'saveProfile');
    fixture.detectChanges(); // Ensure component initializes properly

    // Fill the form with valid data to ensure the button is enabled
    component.profileForm.setValue({
      name: "Michael",
      school: "michael@sc.edu",
      personal: "michael@gmail.com",
      phone: "555-555-5555",
      password: "",
      newPassword: "",
      passwordRetype: ""
    });

    fixture.detectChanges(); // Trigger UI update

    await fixture.whenStable();

    const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');

    expect(submitButton.disabled).toBeFalse(); // Ensure it's clickable

    submitButton.click();
    fixture.detectChanges(); // Allow Angular to process event

    expect(component.saveProfile).toHaveBeenCalledOnceWith();
  })
  */

  // Component save method should call settings service save method with appropriate arguments
  it('should call applicable SettingsService methods when component.saveNotifications() is called', async () => {
    component.preferredName = "Michael";
    component.personalEmail = "mpikula@gmail.com";
    component.schoolEmail = "m@email.sc.edu";  // This should not be saved
    component.phoneNumber = "555-555-5555"

    await component.saveProfile();

    expect(mockSettingsService.updatePreferredName).toHaveBeenCalledOnceWith(MOCK_USER_INFO.id, component.preferredName);
    expect(mockSettingsService.updatePersonalEmail).toHaveBeenCalledOnceWith(MOCK_USER_INFO.id, component.personalEmail);
    expect(mockSettingsService.updatePhoneNumber).toHaveBeenCalledOnceWith(MOCK_USER_INFO.id, component.phoneNumber.replaceAll("-", ""));
  })
});
