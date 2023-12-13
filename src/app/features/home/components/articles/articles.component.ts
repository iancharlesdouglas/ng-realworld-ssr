import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { EMPTY, Observable } from 'rxjs';
import { TagsComponent } from '../tags/tags.component';
import { AsyncPipe, NgClass } from '@angular/common';

/**
 * List of articles (by feed) incl. set of available tags from which to filter
 */
@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [AsyncPipe, NgClass, TagsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  @Input() articles: Observable<Article[]> = EMPTY;
  @Input() pages: Observable<number[]> = EMPTY;
  @Input() tags: Observable<string[]> = EMPTY;
  @Input() page: number | undefined;
}
