import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../../course';

@Component({
  selector: 'app-due-soon-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './due-soon-sidebar.component.html',
  styleUrls: ['./due-soon-sidebar.component.css']
})
export class DueSoonSidebarComponent implements OnChanges {
  @Input() assignments: Assignment[] = [];

  ngOnChanges(changes: SimpleChanges) {
  }
}
