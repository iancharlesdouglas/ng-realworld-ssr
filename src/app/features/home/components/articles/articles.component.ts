import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { EMPTY, Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
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
	imports: [AsyncPipe, DecimalPipe, NgClass, PaginationComponent, RouterLink, AuthorshipComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './articles.component.html',
	styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
	@Input() articles$: Observable<Article[]> = EMPTY;
	@Input() user$: Observable<User | undefined> = EMPTY;
	@Input() pages$: Observable<number[]> = EMPTY;
	@Input() page$: Observable<number> = EMPTY;
	@Output() pageChanged = new EventEmitter<number>();
	@Output() articleFavorited = new EventEmitter<Article>();
	@Output() articleUnfavorited = new EventEmitter<Article>();

	/**
	 * Handles page selection
	 * @param page Page
	 */
	pageSelected(page: number): void {
		this.pageChanged.emit(page);
	}

	/**
	 * Handles favoriting of an article
	 * @param article Article
	 */
	favorited(article: Article): void {
		this.articleFavorited.emit(article);
	}

	/**
	 * Handles unfavoriting of an article
	 * @param article Article
	 */
	unfavorited(article: Article): void {
		this.articleUnfavorited.emit(article);
	}
}
