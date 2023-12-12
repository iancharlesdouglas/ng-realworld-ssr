import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from '../../shared/model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, map,  take, tap } from 'rxjs';
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
  tags: Observable<string[]> = EMPTY;

  constructor(private readonly homeService: HomeService) {}

  async ngOnInit(): Promise<void> {
    this.articles = this.homeService.getArticles().pipe(
      tap((response) => {
        this.articlesCount = response.articlesCount;
      }),
      map((response) => response.articles),
      take(5)
    );
    this.tags = this.homeService.getTags().pipe(map((response) => response.tags));
  }
}
