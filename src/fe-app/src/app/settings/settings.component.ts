import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ RouterOutlet, RouterModule, SettingsSidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor() {}
}
