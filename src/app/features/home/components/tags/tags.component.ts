import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

/**
 * List of tags available to filter on
 */
@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
  @Input() tags: Observable<string[]> = EMPTY;
}
