import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, Observable, concatAll, map } from 'rxjs';
import { Article } from '../../shared/model/article';
import { ArticleService } from '../../shared/services/article.service';
import { AsyncPipe } from '@angular/common';
import { MarkdownPipe } from '../../layout/pipes/markdown-pipe';
import { ArticleHeaderComponent } from './components/article-header/article-header.component';
import { ArticleControlsComponent } from './components/article-controls/article-controls.component';
import { AuthorshipComponent } from './components/authorship/authorship.component';
import { ArticleCommentsComponent } from './components/article-comments/article-comments.component';
import { User } from '../../shared/model/user';
import { StateService } from '../../shared/services/state/state.service';

/**
 * Single article component
 */
@Component({
  selector: 'app-article',
  standalone: true,
  imports: [AsyncPipe, MarkdownPipe, RouterLink, ArticleHeaderComponent, ArticleControlsComponent, AuthorshipComponent, ArticleCommentsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article.component.html',
})
export class ArticleComponent {
  article$: Observable<Article> = EMPTY;
  user$: Observable<User | undefined>;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly articleService: ArticleService, private readonly stateService: StateService) {
    this.article$ = this.activatedRoute.params.pipe(
      map(params => this.articleService.getArticle(params['id'])),
      concatAll(),
    );
    this.user$ = this.stateService.user$;
  }
}
