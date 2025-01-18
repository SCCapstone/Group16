import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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

  // TODO trying to load 
  profileForm = new FormGroup({
    name: new FormControl(),
    school: new FormControl(),
    personal: new FormControl(),
    phone: new FormControl()
  })

  constructor() {
    // TODO load variables from settings service when it is implemented, these are temporary
    this.preferredName = "Michael"
    this.schoolEmail = "michael@sc.edu"
    this.personalEmail = "michael@gmail.com"
    this.phoneNumber = "555-555-5555"

    // TODO this sucks figure out if there's a better way
    this.profileForm.setValue({
      name: this.preferredName,
      school: this.schoolEmail,
      personal: this.personalEmail,
      phone: this.phoneNumber
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
