import { Component, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
  phoneNumber: Number = 0;  // TODO this should be stored as a string, ask about changes

  loginService = inject(LoginService);
  settingsService = inject(SettingsService);

  profileForm = new FormGroup({
    name: new FormControl(),
    school: new FormControl(),
    personal: new FormControl(),
    phone: new FormControl()
  })

  constructor() {
    // Load necessary settings from database and initialize form
    this.settingsService.getUserInfo(this.loginService.getUserId()).then((userInfo: UserInfo) => {
      this.preferredName = userInfo.name.preferredDisplayName;
      this.schoolEmail = userInfo.contact.institutionEmail;
      this.personalEmail = userInfo.contact.email;
      this.phoneNumber = userInfo.contact.mobilePhone;

      // Set form control values with values from database
      this.profileForm.setValue({
        name: this.preferredName,
        school: this.schoolEmail,
        personal: this.personalEmail,
        phone: this.phoneNumber
      })
    })
  }

  saveProfile() {
    // TODO validate properly
    this.preferredName = this.profileForm.value.name ?? "";
    this.schoolEmail = this.profileForm.value.school ?? "";
    this.personalEmail = this.profileForm.value.personal ?? "";
    this.phoneNumber = this.profileForm.value.phone ?? "";

    // TODO call course service with new info

    alert(this.preferredName + " | " + this.schoolEmail + " | " + this.personalEmail + " | " + this.phoneNumber);
  }
}
