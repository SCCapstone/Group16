import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GradesComponent } from './grades.component';

describe('GradesComponent', () => {
  let component: GradesComponent;
  let fixture: ComponentFixture<GradesComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };

    await TestBed.configureTestingModule({
      imports: [GradesComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
