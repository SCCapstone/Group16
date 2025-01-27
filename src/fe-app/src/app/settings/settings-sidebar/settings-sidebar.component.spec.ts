import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSidebarComponent } from './settings-sidebar.component';

import { provideRouter } from '@angular/router';  // Necessary to add to providers list or else NullInjectorError for ActivatedRoute
import { routes } from '../../app.routes';


describe('SettingsSidebarComponent', () => {
  let component: SettingsSidebarComponent;
  let fixture: ComponentFixture<SettingsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsSidebarComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
