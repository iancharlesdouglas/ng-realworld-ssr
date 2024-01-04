import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, Subscription, combineLatest, map, merge, range, tap, toArray } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { StateService } from '../../shared/services/state/state.service';
import { User } from '../../shared/model/user';
import { TagsComponent } from './components/tags/tags.component';
import { ActiveFeed, Feed } from '../../shared/model/feed';
import { RouterLink, ActivatedRoute } from '@angular/router';

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
  articles: Observable<Article[]> = EMPTY;
  articlesCount = 0;
  page$: Observable<number>;
  private pageSub?: Subscription;
  user$: Observable<User | undefined>;
  feed$: Observable<ActiveFeed | undefined>;
  pageSize = 10;
  pages: Observable<number[]> = EMPTY;
  tags: Observable<string[]> = EMPTY;
  Feed = Feed;

  constructor(private readonly homeService: HomeService, private readonly stateService: StateService, private readonly activatedRoute: ActivatedRoute) {
    this.user$ = this.stateService.user$;
    this.page$ = this.stateService.page$;

    // TODO - filter out route events
    const feedFromRoute$ = this.activatedRoute.queryParamMap.pipe(
      map(params => {
        if (params.has('filter') && Object.keys(Feed).includes(params.get('filter')!)) {
          return {feed: params.get('filter') as Feed, tag: params.get('tag') as string} as ActiveFeed | undefined;
        }
        return {feed: Feed.global, tag: undefined} as ActiveFeed | undefined;
      }),
      tap(feed => {
        if (feed?.feed !== Feed.global) {
          this.stateService.setHomePageFeed(feed);
        }
      }));

    this.feed$ = merge(feedFromRoute$, this.stateService.homePageFeed$);
  }

  async ngOnInit(): Promise<void> {
    this.getArticles();
    this.tags = this.homeService.getTags().pipe(map((response) => response.tags));
  }

  ngOnDestroy(): void {
    this.pageSub?.unsubscribe();
  }

  private async getArticles() {
    this.pageSub = combineLatest([this.page$, this.feed$]).pipe(tap(([page, feed]) => {
      if (feed) {
        this.articles = this.homeService.getArticles(feed.feed, page, this.pageSize, feed.tag).pipe(
          tap((response) => {
            this.pages = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
              .pipe(toArray());
          }),
          map(response => response.articles)
        );
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
}
