import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, ReplaySubject, Subscription, concatAll, firstValueFrom, map } from 'rxjs';
import { Article } from '../../shared/model/article';
import { ArticleService } from '../../shared/services/article.service';
import { AsyncPipe } from '@angular/common';
import { MarkdownPipe } from '../../layout/pipes/markdown-pipe';
import { ArticleHeaderComponent } from './components/article-header/article-header.component';
import { ArticleControlsComponent } from './components/article-controls/article-controls.component';
import { AuthorshipComponent } from './components/authorship/authorship.component';
import { ArticleCommentsComponent } from './components/article-comments/article-comments.component';
import { User } from '../../shared/model/user';
import { StateService } from '../../shared/services/state/state.service';
import { ProfileService } from '../../shared/services/profile.service';
import { FromPage } from '../../shared/model/from-page';

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
    ).subscribe(article => this.article$.next(article));
    this.user$ = this.stateService.user$;
  }

  private fetchArticle(id: string): Observable<Article> {
    return this.articleService.getArticle(id);
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

  ngOnDestroy(): void {
    this.articleSub?.unsubscribe();
  }
}
