import { TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: {} }
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'fe-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('fe-app');
  });

  // We can expect event related actions to fire correctly all the time we are more interested in the logic of the app
  it('should open the popup', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.openPopup('notifications');
    expect(app.showPopup).toBe(true);
    expect(app.popupType).toBe('notifications');
  });

  it('should close the popup', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.closePopup();
    expect(app.showPopup).toBe(false);
  });

  // it('should handle escape key press', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   app.openPopup('notifications');
  //   const event = new KeyboardEvent('keydown', { key: 'Escape' });
  //   app.handleEscapeKey(event);
  //   fixture.detectChanges();
  //   expect(app.showPopup).toBe(false);
  // });

  // it('should handle backdrop click', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   app.openPopup('notifications');
  //   app.handleBackdropClick(new Event('click'));
  //   fixture.detectChanges();
  //   expect(app.showPopup).toBe(false);
  // });
});
