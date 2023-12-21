import { Component, Input } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ArticleControlsComponent } from '../article-controls/article-controls.component';
import { AuthorshipComponent } from '../authorship/authorship.component';

@Component({
  selector: 'app-article-header',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, ArticleControlsComponent, AuthorshipComponent],
  templateUrl: './article-header.component.html',
})
export class ArticleHeaderComponent {
  @Input() article: Article | undefined;
  @Input() signedIn = true;
}
