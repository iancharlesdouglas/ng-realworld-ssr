import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, Subscription, map, range, tap, toArray } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StateService } from '../../shared/services/state/state.service';

/**
 * Home page component, incl. banner and list of articles
 */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticlesComponent, AsyncPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  articles: Observable<Article[]> = EMPTY;
  articlesCount = 0;
  page$: Observable<number>;
  private pageSub?: Subscription;
  pageSize = 10;
  pages: Observable<number[]> = EMPTY;
  tags: Observable<string[]> = EMPTY;

  constructor(private readonly homeService: HomeService, private readonly stateService: StateService) {
    this.page$ = this.stateService.page$;
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
      this.articles = this.homeService.getArticles(page, this.pageSize).pipe(
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
  }}
