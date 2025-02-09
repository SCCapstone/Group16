import { Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';

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

  router = inject(Router);
  
  constructor() {
    this.getSelectedPageFromURL();
  }

  getSelectedPageFromURL() {
    switch (this.router.url) {
      case ("/settings/appearance"):
        this.selectedPage = 1;
        break;
      case ("/settings/notifications"):
        this.selectedPage = 2;
        break;
      case ("/settings/sign-out"):
        this.selectedPage = 3;
        break;
      default:
        this.router.navigateByUrl("/settings/profile");
        this.selectedPage = 0;
    }
  }

  selectPage(index: number) {
    this.selectedPage = index;
  }

  getStyle(index: number): string {
    if (index === this.selectedPage)
      return "option selected";
    return "option";
  }
}
