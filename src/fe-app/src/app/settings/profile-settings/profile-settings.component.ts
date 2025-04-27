import { Component, inject, computed, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { UserInfo, Name, ContactInfo } from '../../user';
import { LoginService } from '../../login.service';
import { SettingsService } from '../../settings.service';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile-settings',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './profile-settings.component.html',
    styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {

  preferredName: string = "";
  schoolEmail: string = "";
  personalEmail: string = "";
  phoneNumber: string = "";
  profileConfirm: boolean = false;

  viewPassword: boolean = false;
  passwordMessage: string = "";
  passwordSuccess: boolean = false;

  loginService = inject(LoginService);
  settingsService = inject(SettingsService);

  profileForm = new FormGroup({
    name: new FormControl("", Validators.required),
    school: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.email]),
    personal: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]{3}-?[0-9]{3}-?[0-9]{4}")]),
    password: new FormControl(""),
    newPassword: new FormControl(""),
    passwordRetype: new FormControl("")
  });

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Loads all profile settings through the SettingsService and populates form.
   * Note: ngOnInit is a lifecycle hook that is called when this component is initialized.
   */
  ngOnInit() {
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
        password: "",
        newPassword: "",
        passwordRetype: ""
      })

      this.cdr.detectChanges();
    })
  }

  /**
   * Opens or closes the password popup based on the given parameter.
   * @param open True to open the password window, false to close it.
   */
  callPasswordWindow(open: boolean) {

    // Wipe fields and messages
    this.profileForm.patchValue({
      password: "",
      newPassword: "",
      passwordRetype: ""
    });
    this.passwordMessage = ""
    this.viewPassword = open;

    this.cdr.detectChanges();
  }

  /**
   * Returns the CSS class of the password confirmation message based on whether or not the most recent save attempt was successful
   */
  getMessageStyle() {
    if (this.passwordSuccess)
      return "success";
    return "error"
  }
  
  /**
   * Gets the valid property of the profile settings form, determining whether or not that section of settings can be submitted.
   * @returns ProfileSettingsComponent.profileForm.valid
   */
  getProfileValidator() {
    return this.profileForm.valid;
  }

  /**
   * Checks to see if there have been any changes to the content of the name, personal email, or phone fields
   * @returns True if there have been changes, false otherwise
   */
  checkForChanges(): boolean {
    return this.profileForm.value.name != this.preferredName
          || this.profileForm.value.personal != this.personalEmail
          || this.profileForm.value.phone?.replaceAll("-", "") != this.phoneNumber.replaceAll("-", "");
  }

  /**
   * Attempts to save the user's new password by validating the entry and making the necessary service calls.
   */
  async attemptPasswordSave() {
    if (this.profileForm.value.newPassword != this.profileForm.value.passwordRetype) {
      this.passwordSuccess = false;
      this.passwordMessage = "Passwords do not match"
      return
    }

    // Note: "as string | null" is necessary because typescript randomly allows it to also be undefined and it ruins everything
    const oldPassword = this.profileForm.value.password as string | null;
    const newPassword = this.profileForm.value.newPassword as string | null;
    try {
      await this.settingsService.updatePassword(this.loginService.getUserId(), oldPassword, newPassword);
    }
    catch (error: unknown) {
      this.passwordSuccess = false;
      if (error instanceof Error)
        this.passwordMessage = error.message;
      else
        this.passwordMessage = "Unexpected error, please try again later";
      this.cdr.detectChanges();
      return
    }

    this.passwordSuccess = true;
    this.passwordMessage = "Password saved!"
    this.cdr.detectChanges();
  }

  /**
   * Attempts to save profile information, excluding password information
   */
  async saveProfile() {

    try {
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

      this.profileConfirm = true;
    }
    catch (error: unknown) {
      throw error;
    }
  }
}
