import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ArticleControlsComponent } from '../article-controls/article-controls.component';
import { AuthorshipComponent } from '../authorship/authorship.component';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../../../shared/model/user';

@Component({
  selector: 'app-article-header',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, ArticleControlsComponent, AuthorshipComponent],
  templateUrl: './article-header.component.html',
})
export class ArticleHeaderComponent {
  @Input() article: Article | undefined;
  @Input() user$: Observable<User | undefined> = EMPTY;
  @Output() followAuthor = new EventEmitter<string>();
  @Output() unfollowAuthor = new EventEmitter<string>();
  @Output() articleFavorited = new EventEmitter<Article>();
  @Output() articleUnfavorited = new EventEmitter<Article>();
  @Output() editArticle = new EventEmitter<Article>();
  @Output() deleteArticle = new EventEmitter<Article>();

  /**
   * Handles follow author request
   * @param username Username
   */
  follow(username: string): void {
    this.followAuthor.emit(username);
  }

  /**
   * Handles unfollow author request
   * @param username Username
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
