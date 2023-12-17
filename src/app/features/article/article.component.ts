import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { EMPTY, Observable, Subscription, concatAll, filter, map, switchAll, tap } from 'rxjs';
import { Article } from '../../shared/model/article';
import { ArticleService } from '../../shared/services/article.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  article$: Observable<Article> = EMPTY;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private readonly articleService: ArticleService) {
    this.article$ = activatedRoute.params.pipe(
      map(params => this.articleService.getArticle(params['id'])),
      concatAll(),
      tap(art => {
        console.log('article', art);
        console.log('article inner', (art as any).article);
      })
    );
    // this.article$ = router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   map(() => activatedRoute.params),
    //   switchAll(),
    //   map(params => this.articleService.getArticle(params['id'])),
    //   concatAll(),
    //   tap(art => {
    //     debugger;
    //   })
    // );
  }
}
