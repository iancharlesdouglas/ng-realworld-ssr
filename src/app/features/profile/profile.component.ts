import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../shared/services/profile.service';
import { EMPTY, Observable, ReplaySubject, Subscription, combineLatest, concatAll, distinctUntilChanged, firstValueFrom, map, range, tap, toArray } from 'rxjs';
import { Profile } from '../../shared/model/profile';
import { AsyncPipe, NgClass } from '@angular/common';
import { StateService } from '../../shared/services/state/state.service';
import { User } from '../../shared/model/user';
import { Feed } from '../../shared/model/feed';
import { ArticlesComponent } from '../home/components/articles/articles.component';
import { Article } from '../../shared/model/article';
import { filterParam } from '../../shared/model/filter-param';
import { FromPage } from '../../shared/model/from-page';
import { ArticleService } from '../../shared/services/article.service';

/**
 * Author profile component, incl. list of articles
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticlesComponent, AsyncPipe, NgClass, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile$: Observable<Profile>;
  user$: Observable<User | undefined>;
  Feed = Feed;
  articles$ = new ReplaySubject<Article[]>();
  page$: Observable<number>;
  private pageSub?: Subscription;
  private routeSub?: Subscription;
  feed$: Observable<Feed | undefined>;
  pageSize = 10;
  pages$: Observable<number[]> = EMPTY;
  private feed: Feed | undefined;
  private page: number | undefined;
  private profile: Profile | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService,
    private readonly stateService: StateService,
    private readonly articleService: ArticleService,
    private readonly router: Router)
  {
    this.profile$ = this.activatedRoute.params.pipe(
      map(params => this.profileService.find(params['username'])),
      concatAll()
    );
    this.user$ = this.stateService.user$;
    this.page$ = this.stateService.profilePage$;

    this.routeSub = this.activatedRoute.queryParamMap.pipe(
      map(params => {
        if (params.has(filterParam) && Object.keys(Feed).includes(params.get(filterParam)!)) {
          return params.get(filterParam) as Feed;
        }
        return undefined;
      }),
      tap(feed => {
        if (feed) {
          this.stateService.setProfilePageFeed(feed);
          this.stateService.setProfilePage(0);
        }
      })).subscribe();

    this.feed$ = this.stateService.profilePageFeed$;
  }

  async ngOnInit(): Promise<void> {
    this.getArticles();
  }

  ngOnDestroy(): void {
    this.pageSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  private async getArticles() {
    if (this.pageSub) {
      this.pageSub.unsubscribe();
    }
    this.pageSub = combineLatest([this.profile$, this.page$, this.feed$]).pipe(distinctUntilChanged(), tap(async ([profile, page, feed]) => {
      if (feed) {
        const articles = await firstValueFrom(this.profileService.getArticles(profile.username, feed, page, this.pageSize).pipe(
          tap((response) => {
            this.pages$ = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
              .pipe(toArray());
          }),
          map(response => response.articles)
        ));
        this.feed = feed;
        this.page = page;
        this.profile = profile;
        this.articles$.next(articles);
      }
    })).subscribe();
  }

  /**
   * Handles page selection
   * @param page Page
   */
  async pageSelected(page: number): Promise<void> {
    return this.stateService.setProfilePage(page);
  }

  /**
   * Handles request to follow this profile
   * @param username Profile username
   */
  async follow(username: string): Promise<void> {
    const user = await firstValueFrom(this.user$);
    if (user) {
      this.profile$ = this.profileService.follow(username);
    } else {
      const { url, queryParams } = this.activatedRoute.snapshot;
      const fromPage: FromPage = { url, queryParams };
      this.router.navigate(['/login'], { state: fromPage });
    }
  }

  /**
   * Handles request to unfollow this profile
   * @param username Profile username
   */
  async unfollow(username: string): Promise<void> {
    this.profile$ = this.profileService.unfollow(username);
  }

  /**
   * Handles favoriting an article, and updates the articles
   * @param article Article
   */
  async favoriteArticle(article: Article): Promise<void> {
    const articles = await firstValueFrom(this.articleService.favoriteArticle(article).pipe(
      map(() => this.fetchArticles()),
      concatAll()));
    this.articles$.next(articles);
  }

  /**
   * Handles unfavoriting an article, and updates the articles
   * @param article Article
   */
  async unfavoriteArticle(article: Article): Promise<void> {
    const articles = await firstValueFrom(this.articleService.unfavoriteArticle(article).pipe(
      map(() => this.fetchArticles()),
      concatAll()));
    this.articles$.next(articles);
  }

  private fetchArticles() {
    return this.profileService.getArticles(this.profile!.username, this.feed!, this.page!, this.pageSize).pipe(
      tap((response) => {
        this.pages$ = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
          .pipe(toArray());
      }),
      map(response => response.articles))
  }
}
