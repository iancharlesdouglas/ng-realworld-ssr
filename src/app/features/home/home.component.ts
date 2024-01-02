import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, Subscription, filter, map, merge, range, tap, toArray } from 'rxjs';
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
  feed: Feed = Feed.global;
  pageSize = 10;
  pages: Observable<number[]> = EMPTY;
  tags: Observable<string[]> = EMPTY;
  Feed = Feed;

  constructor(private readonly homeService: HomeService, private readonly stateService: StateService, private readonly activatedRoute: ActivatedRoute) {
    this.user$ = this.stateService.user$;
    this.page$ = this.stateService.page$;
    const feedFromStateOrRoute$ = merge(this.activatedRoute.queryParamMap.pipe(
      map(params => {
        if (params.has('filter') && Object.keys(Feed).includes(params.get('filter')!)) {
          return params.get('filter') as Feed;
        }
        return undefined;
      }),
      filter(feed => !!feed)),
      this.stateService.homePageFeed$);
    this.feed$ = feedFromStateOrRoute$.pipe(
      map(feed => feed || Feed.global),
      tap(feed => {
        this.feed = feed;
        this.stateService.setHomePageFeed(feed);
      }));
  }


  async ngOnInit(): Promise<void> {
    this.getArticles();
    this.tags = this.homeService.getTags().pipe(map((response) => response.tags));
  }

  ngOnDestroy(): void {
    this.pageSub?.unsubscribe();
  }

  private async getArticles() {
    this.pageSub = this.page$.subscribe(page => {
      this.articles = this.homeService.getArticles(this.feed!, page, this.pageSize).pipe(
        tap((response) => {
          this.pages = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
            .pipe(toArray());
        }),
        map(response => response.articles),
      );
    });
  }

  /**
   * Handles page selection
   * @param page Page
   */
  async pageSelected(page: number): Promise<void> {
    await this.stateService.setPage(page);
  }
}
