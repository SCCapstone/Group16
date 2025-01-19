import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './settings-sidebar.component.html',
  styleUrl: './settings-sidebar.component.css'
})
export class SettingsSidebarComponent
{
  selectedPage: string = ""  // For CSS styling
  
  constructor() {}

  selectPage() {

  }
}
