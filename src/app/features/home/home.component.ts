import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, map, range, tap, toArray } from 'rxjs';
import { AsyncPipe } from '@angular/common';

/**
 * Home page component, incl. banner and initial list of articles
 */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticlesComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  articles: Observable<Article[]> = EMPTY;
  articlesCount = 0;
  page = 0;
  pageSize = 10;
  pages: Observable<number[]> = EMPTY;
  tags: Observable<string[]> = EMPTY;

  constructor(private readonly homeService: HomeService, private readonly changeDetector: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    // const articles$ = this.homeService.getArticles();
    // const page$ = of(1);
    // const blah$ = page$.pipe(combineLatestWith(articles$), map(([, articles]) => articles));

    this.articles = this.homeService.getArticles().pipe(
      tap((response) => {
        this.pages = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
          .pipe(toArray());
        this.changeDetector.detectChanges();
      }),
      map((response) => response.articles.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize)),
    );
    this.tags = this.homeService.getTags().pipe(map((response) => response.tags));
  }
}
