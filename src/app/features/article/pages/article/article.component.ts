import { CommentToDelete } from './../../model/comment-to-delete';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, ReplaySubject, Subscription, concatAll, firstValueFrom, map } from 'rxjs';
import { Article } from '../../../../shared/model/article';
import { ArticleService } from '../../../../shared/services/article.service';
import { AsyncPipe } from '@angular/common';
import { MarkdownPipe } from '../../../../shared/pipes/markdown-pipe';
import { ArticleHeaderComponent } from '../../components/article-header/article-header.component';
import { ArticleControlsComponent } from '../../components/article-controls/article-controls.component';
import { AuthorshipComponent } from '../../components/authorship/authorship.component';
import { ArticleCommentsComponent } from '../../components/article-comments/article-comments.component';
import { User } from '../../../../shared/model/user';
import { StateService } from '../../../../shared/services/state/state.service';
import { ProfileService } from '../../../../shared/services/profile.service';
import { FromPage } from '../../../../shared/model/from-page';
import { Comment } from '../../../../shared/model/comment';
import { CommentToAdd } from '../../model/comment-to-add';

/**
 * Single article component
 */
@Component({
  selector: 'app-article',
  standalone: true,
  imports: [AsyncPipe, MarkdownPipe, RouterLink, ArticleHeaderComponent, ArticleControlsComponent, AuthorshipComponent, ArticleCommentsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article.component.html',
})
export class ArticleComponent implements OnDestroy {
  article$ = new ReplaySubject<Article>();
  comments$ = new ReplaySubject<Comment[]>;
  user$: Observable<User | undefined>;
  private articleSlug: string | undefined;
  private articleSub: Subscription | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly articleService: ArticleService,
    private readonly stateService: StateService,
    private readonly profileService: ProfileService) {
    this.articleSub = this.activatedRoute.params.pipe(
      map(params => {
        this.articleSlug = params['id'];
        return this.fetchArticle(this.articleSlug!);
      }),
      concatAll(),
    ).subscribe(async article => {
      this.article$.next(article);
      const comments = await firstValueFrom(this.articleService.getComments(article));
      this.comments$.next(comments);
    });
    this.user$ = this.stateService.user$;
  }

  private fetchArticle(id: string): Observable<Article> {
    return this.articleService.getArticle(id);
  }

  ngOnDestroy(): void {
    this.articleSub?.unsubscribe();
  }

  /**
   * Handles following of an author
   * @param username Author username
   */
  async follow(username: string): Promise<void> {
    const user = await firstValueFrom(this.user$);
    if (user) {
      await firstValueFrom(this.profileService.follow(username));
      await this.refreshArticle();
      } else {
      const { url, queryParams } = this.activatedRoute.snapshot;
      const fromPage: FromPage = { url, queryParams };
      this.router.navigate(['/login'], { state: fromPage });
    }
  }

  private async refreshArticle() {
    const article = await firstValueFrom(this.fetchArticle(this.articleSlug!));
    this.article$.next(article);
  }

  /**
   * Handles unfollowing of an author
   * @param username Author username
   */
  async unfollow(username: string): Promise<void> {
    await firstValueFrom(this.profileService.unfollow(username));
    await this.refreshArticle();
  }

  /**
   * Handles favoriting of an article
   * @param article Article
   */
  async favorited(article: Article): Promise<void> {
    const article$ = this.articleService.favoriteArticle(article);
    const favoritedArticle = await firstValueFrom(article$);
    this.article$.next(favoritedArticle);
  }

  /**
   * Handles unfavoriting of an article
   * @param article Article
   */
  async unfavorited(article: Article): Promise<void> {
    const article$ = this.articleService.unfavoriteArticle(article);
    const unfavoritedArticle = await firstValueFrom(article$);
    this.article$.next(unfavoritedArticle);
  }

  /**
   * Handles editing an article
   * @param article Article
   */
  edit(article: Article): void {
    this.router.navigate(['/editor', article.slug]);
  }

  /**
   * Handles deleting an article
   * @param article Article
   */
  async delete(article: Article): Promise<void> {
    await firstValueFrom(this.articleService.deleteArticle(article));
    this.router.navigate(['/']);
  }

  /**
   * Posts a comment on an article
   * @param commentToAdd Article with comment to add
   */
  async postComment(commentToAdd: CommentToAdd): Promise<void> {
    const savedComment = await firstValueFrom(this.articleService.addComment(commentToAdd.article, commentToAdd.comment));
    const existingComments = await firstValueFrom(this.comments$);
    const updatedComments = [...existingComments, savedComment];
    this.comments$.next(updatedComments);
  }

  /**
   * Removes a comment from an article
   * @param commentToDelete Comment to remove
   */
  async removeComment(commentToDelete: CommentToDelete): Promise<void> {
    await firstValueFrom(this.articleService.deleteComment(commentToDelete.article, commentToDelete.comment));
    const updatedComments = await firstValueFrom(this.articleService.getComments(commentToDelete.article));
    this.comments$.next(updatedComments);
  }
}
