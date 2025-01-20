import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './settings-sidebar.component.html',
  styleUrl: './settings-sidebar.component.css'
})
export class SettingsSidebarComponent
{
  selectedPage: number = 0  // For CSS styling
  
  // TODO handle reload or user moving to page directly via url, currently always starts on profile
  constructor() {}

  selectPage(index: number) {
    this.selectedPage = index;
  }

  getStyle(index: number): string {
    if (index === this.selectedPage)
      return "option selected";
    return "option";
  }
}
