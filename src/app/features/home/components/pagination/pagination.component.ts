import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pages: Observable<number[]> = EMPTY;
  @Input() page$: Observable<number> = EMPTY;
  @Output() pageChanged = new EventEmitter<number>();

  /**
   * Handles page selection
   * @param page Page
   */
  pageSelected(page: number): void {
    this.pageChanged.emit(page);
  }
}
