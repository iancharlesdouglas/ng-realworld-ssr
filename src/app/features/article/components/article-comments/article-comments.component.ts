import { Component, Input } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../../../shared/model/user';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Comment } from '../../../../shared/model/comment';

@Component({
  selector: 'app-article-comments',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './article-comments.component.html',
  styleUrl: './article-comments.component.scss'
})
export class ArticleCommentsComponent {
  @Input() article: Article | undefined;
  @Input() comments$: Observable<Comment[]> = EMPTY;
  @Input() user$: Observable<User | undefined> = EMPTY;
}
