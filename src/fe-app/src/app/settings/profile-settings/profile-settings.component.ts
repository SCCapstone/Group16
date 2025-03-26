import { Component, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { UserInfo, Name, ContactInfo } from '../../user';
import { LoginService } from '../../login.service';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {
  
  preferredName: string = "";
  schoolEmail: string = "";
  personalEmail: string = "";
  phoneNumber: string = "";

  password: string = "";
  passwordRetype: string = "";
  viewPassword: boolean = false;

  loginService = inject(LoginService);
  settingsService = inject(SettingsService);

  profileForm = new FormGroup({
    name: new FormControl("", Validators.required),
    school: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.email]),
    personal: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]{3}-?[0-9]{3}-?[0-9]{4}")]),
    password: new FormControl(""),
    passwordRetype: new FormControl("")
  });

  constructor() {
    // Load necessary settings from database and initialize form
    this.settingsService.getUserInfo(this.loginService.getUserId()).then((userInfo: UserInfo) => {
      this.preferredName = userInfo.name.preferredDisplayName;
      this.schoolEmail = userInfo.contact.institutionEmail;
      this.personalEmail = userInfo.contact.email;
      this.phoneNumber = userInfo.contact.mobilePhone;

      // Put phone number in more readable format
      this.phoneNumber = this.phoneNumber.substring(0, 3) + "-" + this.phoneNumber.substring(3, 6) + "-" + this.phoneNumber.substring(6, 10);

      // Set form control values with values from database
      this.profileForm.setValue({
        name: this.preferredName,
        school: this.schoolEmail,
        personal: this.personalEmail,
        phone: this.phoneNumber,
        password: this.password,
        passwordRetype: this.passwordRetype
      })
    })
  }

  /**
   * Opens or closes the password popup based on the given parameter.
   * @param open True to open the password window, false to close it.
   */
  callPasswordWindow(open: boolean) {
    console.log("Call popup");

    this.viewPassword = open;
  }

  /**
   * Attempts to save the user's new password by validating the entry and making the necessary service calls.
   */
  attemptPasswordSave() {
    console.log("Save password");

    this.callPasswordWindow(false);
  }

  /**
   * Attempts to save profile information, excluding password information
   */
  async saveProfile() {

    // Update preferred name
    if (this.profileForm.value.name != null && this.profileForm.value.name != this.preferredName) {
      this.preferredName = this.profileForm.value.name;
      await this.settingsService.updatePreferredName(this.loginService.getUserId(), this.preferredName);
    }

    // Update personal email
    if (this.profileForm.value.personal != null && this.profileForm.value.personal != this.personalEmail) {
      this.personalEmail = this.profileForm.value.personal;
      await this.settingsService.updatePersonalEmail(this.loginService.getUserId(), this.personalEmail);
    }

    // Update phone number
    if (this.profileForm.value.phone != null && this.profileForm.value.phone != this.phoneNumber) {
      this.phoneNumber = this.profileForm.value.phone;
      this.phoneNumber = this.phoneNumber.replaceAll("-", "");  // Remove dashes from user input
      await this.settingsService.updatePhoneNumber(this.loginService.getUserId(), this.phoneNumber);
    }
  }
}
