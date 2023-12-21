import { Component, Input } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-article-controls',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './article-controls.component.html',
})
export class ArticleControlsComponent {
  @Input() article: Article | undefined;
  @Input() signedIn = true;
}
