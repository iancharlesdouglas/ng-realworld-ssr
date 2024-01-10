import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, ReplaySubject, Subscription, combineLatest, concatAll, distinctUntilChanged, firstValueFrom, map, range, tap, toArray } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { StateService } from '../../shared/services/state/state.service';
import { User } from '../../shared/model/user';
import { TagsComponent } from './components/tags/tags.component';
import { ActiveFeed, Feed } from '../../shared/model/feed';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { filterParam } from '../../shared/model/filter-param';
import { ArticleService } from '../../shared/services/article.service';

/**
 * Home page component, incl. banner and list of articles
 */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticlesComponent, TagsComponent, AsyncPipe, NgClass, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  articles$ = new ReplaySubject<Article[]>();
  page$: Observable<number>;
  private pageSub?: Subscription;
  private routeSub?: Subscription;
  user$: Observable<User | undefined>;
  feed$: Observable<ActiveFeed | undefined>;
  pageSize = 10;
  pages$: Observable<number[]> = EMPTY;
  tags$: Observable<string[]> = EMPTY;
  Feed = Feed;
  private feed: ActiveFeed | undefined;
  private page: number | undefined;

  constructor(
    private readonly homeService: HomeService,
    private readonly stateService: StateService,
    private readonly articleService: ArticleService,
    private readonly activatedRoute: ActivatedRoute)
  {
    this.user$ = this.stateService.user$;
    this.page$ = this.stateService.page$;

    this.routeSub = this.activatedRoute.queryParamMap.pipe(
      map(params => {
        if (params.has(filterParam) && Object.keys(Feed).includes(params.get(filterParam)!)) {
          return {feed: params.get(filterParam) as Feed, tag: params.get('tag') as string} as ActiveFeed | undefined;
        }
        return undefined;
      }),
      tap(feed => {
        if (feed) {
          this.stateService.setHomePageFeed(feed);
          this.stateService.setPage(0);
        }
      })).subscribe();

    this.feed$ = this.stateService.homePageFeed$;
  }

  async ngOnInit(): Promise<void> {
    this.getArticles();
    this.tags$ = this.homeService.getTags().pipe(map((response) => response.tags));
  }

  ngOnDestroy(): void {
    this.pageSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  private async getArticles() {
    this.pageSub = combineLatest([this.page$, this.feed$]).pipe(distinctUntilChanged(), tap(async ([page, feed]) => {
      if (feed) {
        const articles = await firstValueFrom(this.homeService.getArticles(feed.feed, page, this.pageSize, feed.tag).pipe(
          tap((response) => {
            this.pages$ = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
              .pipe(toArray());
          }),
          map(response => response.articles)
        ));
        this.feed = feed;
        this.page = page;
        this.articles$.next(articles);
      }
    })).subscribe();
  }

  /**
   * Handles page selection
   * @param page Page
   */
  async pageSelected(page: number): Promise<void> {
    await this.stateService.setPage(page);
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
    const feed = this.feed?.feed;
    if (feed) {
      return this.homeService.getArticles(feed, this.page!, this.pageSize, undefined, true).pipe(
        tap((response) => {
          this.pages$ = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
            .pipe(toArray());
        }),
        map(response => response.articles));
    }
    return [];
  }
}
