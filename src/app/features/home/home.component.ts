import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, Subscription, combineLatest, distinct, distinctUntilChanged, filter, forkJoin, map, merge, partition, range, tap, toArray } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { StateService } from '../../shared/services/state/state.service';
import { User } from '../../shared/model/user';
import { TagsComponent } from './components/tags/tags.component';
import { Feed } from '../../shared/model/feed';
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
  feed$: Observable<Feed | undefined | null>;
  pageSize = 10;
  pages: Observable<number[]> = EMPTY;
  tags: Observable<string[]> = EMPTY;
  tag$: Observable<string | undefined>;
  Feed = Feed;

  constructor(private readonly homeService: HomeService, private readonly stateService: StateService, private readonly activatedRoute: ActivatedRoute) {
    console.log('home page c..tor');
    this.user$ = this.stateService.user$;
    this.page$ = this.stateService.page$;
    this.tag$ = this.stateService.tag$;
    console.log('state (last)', this.stateService.getLastState());
    const feedFromStateOrRoute$ = merge(this.activatedRoute.queryParamMap.pipe(
      map(params => {
        if (params.has('filter') && Object.keys(Feed).includes(params.get('filter')!)) {
          return {feed: params.get('filter') as Feed, tag: params.get('tag') as string};
        }
        return {feed: undefined, tag: undefined};
      }),
      filter(({feed}) => !!feed)),
      forkJoin([this.stateService.homePageFeed$, this.stateService.tag$]).pipe(
        tap(x => console.log('got state service', x)),
        map(([feed, tag]) => ({feed, tag}))));
    const feedsTags$ = feedFromStateOrRoute$.pipe(
      map(({feed, tag}) => ({feed: feed || Feed.global, tag})),
      distinct(),
      tap(({feed, tag}) => {
        console.log('have feed, tag', feed, tag);
        this.stateService.setHomePageFeed(feed);
        if (tag) {
          this.stateService.setTag(tag);
        }
      }));
    this.feed$ = feedsTags$.pipe(map(({feed}) => feed));
    this.tag$ = feedsTags$.pipe(map(({tag}) => tag));
  }

  async ngOnInit(): Promise<void> {
    this.getArticles();
    this.tags = this.homeService.getTags().pipe(map((response) => response.tags));
  }

  ngOnDestroy(): void {
    this.pageSub?.unsubscribe();
  }

  private async getArticles() {
    this.pageSub = combineLatest([this.page$, this.feed$, this.tag$]).pipe(tap(([page, feed, tag]) => {
      if (feed) {
        this.articles = this.homeService.getArticles(feed, page, this.pageSize, tag).pipe(
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
