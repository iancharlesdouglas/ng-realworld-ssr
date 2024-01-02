import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { EMPTY, Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { AuthorshipComponent } from '../../../article/components/authorship/authorship.component';
import { User } from '../../../../shared/model/user';

/**
 * List of articles (by feed) incl. set of available tags from which to filter
 */
@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [AsyncPipe, NgClass, PaginationComponent, RouterLink, AuthorshipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  @Input() articles: Observable<Article[]> = EMPTY;
  @Input() user$: Observable<User | undefined> = EMPTY;
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
