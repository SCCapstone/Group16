import { Component } from '@angular/core';

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.css'
})
export class AppearanceSettingsComponent {
  primaryColor: string = "";
  accentColor: string = "";
  useUniversityColors: boolean = false;

  updateSettings() {}
}
