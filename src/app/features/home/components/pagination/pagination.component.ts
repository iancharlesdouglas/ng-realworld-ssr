import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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
  @Input() page: number | undefined;
}
