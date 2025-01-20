import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
