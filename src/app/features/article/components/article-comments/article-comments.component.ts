import { Component, Input } from '@angular/core';
import { Article } from '../../../../shared/model/article';

@Component({
  selector: 'app-article-comments',
  standalone: true,
  imports: [],
  templateUrl: './article-comments.component.html',
  styleUrl: './article-comments.component.scss'
})
export class ArticleCommentsComponent {
  @Input() article: Article | undefined;
  @Input() signedIn = true;
}
