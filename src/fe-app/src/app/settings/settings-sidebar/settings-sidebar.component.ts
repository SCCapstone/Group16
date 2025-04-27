// NOTE: This component is currently unused and may be removed in the future. It is a remnant of our old settings layout.

import { Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';

@Component({
    selector: 'app-settings-sidebar',
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

  /**
   * Returns the currently-selected settings page index based on the given URL, or none if URL is unrecognized.
   */
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

  /**
   * Selects the page corresponding to the given index.
   * @param index Index of a page in the list.
   */
  selectPage(index: number) {
    this.selectedPage = index;
  }

  /**
   * Retrieves the CSS class of an item in the page list for styling purposes.
   * @param index Index of the selected page in the list.
   * @returns "option selected" if selected,  "option" otherwise
   */
  getStyle(index: number): string {
    if (index === this.selectedPage)
      return "option selected";
    return "option";
  }
}
