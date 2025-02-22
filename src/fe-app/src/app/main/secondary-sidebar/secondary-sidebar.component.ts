import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Assignment } from '../../course';

@Component({
  selector: 'app-secondary-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secondary-sidebar.component.html',
  styleUrls: ['./secondary-sidebar.component.css']
})
export class SecondarySidebarComponent implements OnChanges {
  @Input() assignments: Assignment[] = [];

  router: Router = inject(Router);

  ngOnChanges(changes: SimpleChanges) {}
}
