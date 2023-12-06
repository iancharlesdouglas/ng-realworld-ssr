import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  afterRender,
  afterNextRender,
} from '@angular/core';
import { HomeService } from './services/home.service';
import { Article } from './model/article';
import { ArticlesComponent } from './components/articles/articles.component';
import { EMPTY, Observable, map, tap } from 'rxjs';
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
  articlesExist = false;

  constructor(private readonly homeService: HomeService) {
    afterNextRender(() => {
      console.log('afterNextRender');
      const updatedArticles = this.homeService.getArticlesFull().pipe(
        map((response) => response.articles));
      const updatedArticlesSub = updatedArticles.pipe(tap(articles => {
        if (articles.length !== this.articlesCount) {
          console.log('replacing list of articles');
          this.articles = updatedArticles;
        }
      })).subscribe();
    });
    afterRender(() => {
      console.log('afterRender');
    });
  }

  async ngOnInit(): Promise<void> {
    this.articles = this.homeService.getArticles().pipe(
      tap((response) => {
        this.articlesCount = response.articlesCount;
        console.log('received articles', response.articlesCount);
      }),
      map((response) => response.articles)
    );
  }
}
