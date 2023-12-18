import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, Observable, concatAll, map } from 'rxjs';
import { Article } from '../../shared/model/article';
import { ArticleService } from '../../shared/services/article.service';
import { AsyncPipe } from '@angular/common';
import { MarkdownPipe } from '../../layout/pipes/markdown-pipe';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [AsyncPipe, MarkdownPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  article$: Observable<Article> = EMPTY;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly articleService: ArticleService) {
    this.article$ = this.activatedRoute.params.pipe(
      map(params => this.articleService.getArticle(params['id'])),
      concatAll(),
    );
  }
}
