import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing'; // Mock Router module
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { GradeCalcComponent } from './grade-calc.component';

// Mock the ActivatedRoute class
class MockActivatedRoute {
  // Optionally, mock any specific methods or properties here if needed
}

describe('GradeCalcComponent', () => {
  let component: GradeCalcComponent;
  let fixture: ComponentFixture<GradeCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeCalcComponent, FormsModule, RouterTestingModule], // Use RouterTestingModule to mock routing
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute } // Mock ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GradeCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate final grade correctly when all weights are set', () => {
    component.assignments = [
      { name: 'Assignment 1', grade: 90, weight: 0.2 },
      { name: 'Assignment 2', grade: 80, weight: 0.3 },
      { name: 'Assignment 3', grade: 85, weight: 0.3 },
      { name: 'Assignment 4', grade: 95, weight: 0.2 }
    ];

    const finalGrade = component.calculateFinalGrade();
    expect(finalGrade).toBeCloseTo(86.5, 1);
  });

  it('should return 0 if total weight is 0', () => {
    component.assignments = [
      { name: 'Assignment 1', grade: 0, weight: 0 },
      { name: 'Assignment 2', grade: 0, weight: 0 },
      { name: 'Assignment 3', grade: 0, weight: 0 },
      { name: 'Assignment 4', grade: 0, weight: 0 }
    ];

    const finalGrade = component.calculateFinalGrade();
    expect(finalGrade).toBe(0);
  });

  it('should add a new assignment', () => {
    const initialLength = component.assignments.length;
    component.assignments.push({ name: 'New Assignment', grade: 0, weight: 0 });
    fixture.detectChanges();
    expect(component.assignments.length).toBe(initialLength + 1);
  });

  it('should remove an assignment', () => {
    component.assignments = [
      { name: 'Assignment 1', grade: 90, weight: 0.2 },
      { name: 'Assignment 2', grade: 80, weight: 0.3 }
    ];

    const initialLength = component.assignments.length;
    component.assignments.splice(0, 1);
    fixture.detectChanges();
    expect(component.assignments.length).toBe(initialLength - 1);
  });

  it('should calculate the final grade with a different set of grades and weights', () => {
    component.assignments = [
      { name: 'Assignment 1', grade: 100, weight: 0.5 },
      { name: 'Assignment 2', grade: 70, weight: 0.5 }
    ];

    const finalGrade = component.calculateFinalGrade();
    expect(finalGrade).toBe(85);
  });
});
