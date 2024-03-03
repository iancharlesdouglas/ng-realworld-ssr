import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../shared/model/user';

/**
 * Application header incl. sign in/sign up links
 */
@Component({
	selector: 'app-header',
	standalone: true,
	imports: [AsyncPipe, NgClass, RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	@Input() user$: Observable<User | undefined> = EMPTY;
	@Input() loggedIn = false;
}
