import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { DecimalPipe, AsyncPipe, NgClass } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../../../shared/model/user';

@Component({
	selector: 'app-article-controls',
	standalone: true,
	imports: [AsyncPipe, DecimalPipe, NgClass],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './article-controls.component.html',
	styleUrls: ['./article-controls.component.scss'],
})
export class ArticleControlsComponent {
	@Input() article: Article | undefined;
	@Input() user$: Observable<User | undefined> = EMPTY;
	@Output() followAuthor = new EventEmitter<string>();
	@Output() unfollowAuthor = new EventEmitter<string>();
	@Output() articleFavorited = new EventEmitter<Article>();
	@Output() articleUnfavorited = new EventEmitter<Article>();
	@Output() editArticle = new EventEmitter<Article>();
	@Output() deleteArticle = new EventEmitter<Article>();

	/**
	 * Handles follow request
	 * @param username Author username
	 */
	follow(username: string): void {
		this.followAuthor.emit(username);
	}

	/**
	 * Handles unfollow request
	 * @param username Author username
	 */
	unfollow(username: string): void {
		this.unfollowAuthor.emit(username);
	}

	/**
	 * Handles favoriting an article
	 * @param article Article
	 */
	favorited(article: Article): void {
		this.articleFavorited.emit(article);
	}

	/**
	 * Handles unfavoriting an article
	 * @param article Article
	 */
	unfavorited(article: Article): void {
		this.articleUnfavorited.emit(article);
	}

	/**
	 * Handles editing an article
	 * @param article Article
	 */
	edit(article: Article): void {
		this.editArticle.emit(article);
	}

	/**
	 * Handles deleting an article
	 * @param article Article
	 */
	delete(article: Article): void {
		this.deleteArticle.emit(article);
	}
}
