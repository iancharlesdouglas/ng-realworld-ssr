import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../model/article';
import { EMPTY, Observable } from 'rxjs';

/**
 * List of articles (by feed) incl. set of available tags from which to filter
 */
@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  @Input() articles: Observable<Article[]> = EMPTY;
}
