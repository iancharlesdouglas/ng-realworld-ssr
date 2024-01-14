import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { DecimalPipe, AsyncPipe } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../../../shared/model/user';

@Component({
  selector: 'app-article-controls',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article-controls.component.html',
})
export class ArticleControlsComponent {
  @Input() article: Article | undefined;
  @Input() user$: Observable<User | undefined> = EMPTY;
  @Output() followAuthor = new EventEmitter<string>();
  @Output() unfollowAuthor = new EventEmitter<string>();

  /**
   * Handles follow request
   * @param username Author username
   */
  follow(username: string): void {
    this.followAuthor.emit(username);
  }

  /**
   * Handles unfollow request
   * @param username Author username
   */
  unfollow(username: string): void {
    this.unfollowAuthor.emit(username);
  }
}
