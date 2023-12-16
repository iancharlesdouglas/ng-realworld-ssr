import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(private readonly homeService: HomeService) {}

  async ngOnInit(): Promise<void> {
    this.getArticles();
    this.tags = this.homeService.getTags().pipe(map((response) => response.tags));
  }

  private async getArticles() {
    this.articles = this.homeService.getArticles(this.page, this.pageSize).pipe(
      tap((response) => {
        this.pages = range(0, Math.floor((response.articlesCount - 1) / this.pageSize) + 1)
          .pipe(toArray());
      }),
      map(response => response.articles)
    );
  }

  /**
   * Handles page selection
   * @param page Page
   */
  async pageSelected(page: number): Promise<void> {
    this.page = page;
    await this.getArticles();
  }}
