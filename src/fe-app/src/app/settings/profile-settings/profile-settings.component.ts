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
  
  // TODO probably don't need these anymore with reactive forms, but too lazy to get rid of them rn
  preferredName: string = "";
  schoolEmail: string = "";
  personalEmail: string = "";
  phoneNumber: string = "";

  loginService = inject(LoginService);
  settingsService = inject(SettingsService);

  profileForm = new FormGroup({
    name: new FormControl("", Validators.required),
    school: new FormControl("", [Validators.required, Validators.email]),
    personal: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]{3}-?[0-9]{3}-?[0-9]{4}")])
  })

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
        phone: this.phoneNumber
      })
    })
  }

  async saveProfile() {
    // TODO gray out university email on page

    // Update preferred name
    if (this.profileForm.value.name != null) {
      this.preferredName = this.profileForm.value.name;
      await this.settingsService.updatePreferredName(this.loginService.getUserId(), this.preferredName);
      console.log("--- SAVING PREFERRED NAME COMPONENT - " + this.preferredName + " ---")
    }

    // Update personal email
    if (this.profileForm.value.personal != null) {
      this.personalEmail = this.profileForm.value.personal;
      await this.settingsService.updatePersonalEmail(this.loginService.getUserId(), this.personalEmail);
      console.log("--- SAVING PERSONAL EMAIL COMPONENT - " + this.personalEmail + " ---")
    }

    // Update phone number
    if (this.profileForm.value.phone != null) {
      this.phoneNumber = this.profileForm.value.phone;
      this.phoneNumber = this.phoneNumber.replaceAll("-", "");  // Remove dashes from user input
      await this.settingsService.updatePhoneNumber(this.loginService.getUserId(), this.phoneNumber);
      console.log("--- SAVING PHONE NUMBER COMPONENT - " + this.phoneNumber + " ---")
    }
  }
}
