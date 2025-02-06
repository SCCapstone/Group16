import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsSidebarComponent } from './settings-sidebar.component';

import { Router, provideRouter } from '@angular/router';
import { routes } from '../../app.routes';


describe('SettingsSidebarComponent', () => {
  let component: SettingsSidebarComponent;
  let fixture: ComponentFixture<SettingsSidebarComponent>;

  let router: Router;

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      imports: [SettingsSidebarComponent],
      providers: [
        provideRouter(routes)
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(SettingsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Upon load, the visually selected route should correspond to the url path; TODO this will fail
  it('should reflect the url path in styling upon load', async () => {
    await router.navigateByUrl("/settings/appearance");
    component.getSelectedPageFromURL();  // Calling router.navigateByUrl by itself does not refresh sidebar so this has to be called manually
    await fixture.whenStable();
    fixture.detectChanges();
    
    const highlightedDiv = fixture.debugElement.nativeElement.querySelector('div[class="option selected"]');
    expect(component.selectedPage).toEqual(1);
    expect(highlightedDiv.children[0].innerHTML).toEqual("Appearance");
  })

  // Clicking on a link (e.g. profile settings) should route to that page and change the selectedPage index
  it('should route to the correct page and update sidebar when a link is clicked', async () => {
    spyOn(router, 'navigateByUrl');

    const notificationsLink = fixture.debugElement.nativeElement.querySelector('p[routerLink="notifications"]')
    notificationsLink.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledOnceWith(jasmine.stringMatching(/notifications/), jasmine.anything());
    expect(component.selectedPage).toEqual(2);  // 2 corresponds with notification settings
  });

  // The visually selected route should update to the corresponding page when the selectedPage index is updated
  it('should reflect that a page has been selected through styling', async () => {
    component.selectedPage = 2;
    await fixture.whenStable;
    fixture.detectChanges();

    const highlightedDiv = fixture.debugElement.nativeElement.querySelector('div[class="option selected"]')
    expect(highlightedDiv?.children[0].innerHTML).toEqual("Notifications");  // Grab the p element inside the selected div and make sure it corresponds to selectedPage
  })
});
