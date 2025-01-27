import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  title = 'Default Title';
  currentValue: string = '';
  constructor(public activatedRoute: ActivatedRoute) {}

  
  logClick() {
    console.log('Log In Button clicked');
  }

  updateValue(newValue: string): void {
    this.currentValue = newValue; // Ensure currentValue is declared
  }
  
}
