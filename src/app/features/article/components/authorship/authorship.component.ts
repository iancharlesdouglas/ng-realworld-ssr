import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../../../shared/model/article';
import { Feed } from '../../../../shared/model/feed';

@Component({
	selector: 'app-authorship',
	standalone: true,
	imports: [DatePipe, RouterLink],
	templateUrl: './authorship.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorshipComponent {
	@Input() article: Article | undefined;
	Feed = Feed;
}
