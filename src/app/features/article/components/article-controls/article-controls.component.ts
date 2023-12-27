import { Component, Input } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { DecimalPipe, AsyncPipe } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../../../shared/model/user';

@Component({
  selector: 'app-article-controls',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './article-controls.component.html',
})
export class ArticleControlsComponent {
  @Input() article: Article | undefined;
  @Input() user$: Observable<User | undefined> = EMPTY;
}
