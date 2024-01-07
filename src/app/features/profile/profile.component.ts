import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService } from '../../shared/services/profile.service';
import { EMPTY, Observable, Subscription, combineLatest, concatAll, distinctUntilChanged, map, range, tap, toArray } from 'rxjs';
import { Profile } from '../../shared/model/profile';
import { AsyncPipe, NgClass } from '@angular/common';
import { StateService } from '../../shared/services/state/state.service';
import { User } from '../../shared/model/user';
import { Feed } from '../../shared/model/feed';
import { ArticlesComponent } from '../home/components/articles/articles.component';
import { Article } from '../../shared/model/article';
import { filterParam } from '../../shared/model/filter-param';

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
  articles: Observable<Article[]> = EMPTY;
  page$: Observable<number>;
  private pageSub?: Subscription;
  private routeSub?: Subscription;
  feed$: Observable<Feed | undefined>;
  pageSize = 10;
  pages: Observable<number[]> = EMPTY;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly profileService: ProfileService, private readonly stateService: StateService) {
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
    this.pageSub = combineLatest([this.profile$, this.page$, this.feed$]).pipe(distinctUntilChanged(), tap(([profile, page, feed]) => {
      console.log('profile ', profile, feed);
      if (feed) {
        this.articles = this.profileService.getArticles(profile.username, feed, page, this.pageSize).pipe(
          tap((response) => {
            console.log('got articles', response.articles);
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
    await this.stateService.setProfilePage(page);
  }
}
