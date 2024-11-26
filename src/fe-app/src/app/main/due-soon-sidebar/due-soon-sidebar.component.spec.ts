import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueSoonSidebarComponent } from './due-soon-sidebar.component';

describe('DueSoonSidebarComponent', () => {
  let component: DueSoonSidebarComponent;
  let fixture: ComponentFixture<DueSoonSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueSoonSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueSoonSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
