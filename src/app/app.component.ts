import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './features/home/home.component';
import { StateService } from './shared/services/state/state.service';
import { UserPersistenceService } from './shared/services/state/user-persistence.service';
import { Observable } from 'rxjs';
import { User } from './shared/model/user';

@Component({
	selector: 'app-root',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, HomeComponent],
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	user$: Observable<User | undefined>;

	constructor(
		private readonly stateService: StateService,
		private readonly userPersistenceService: UserPersistenceService,
	) {
		this.user$ = this.stateService.user$;
	}

	ngOnInit(): void {
		const user = this.userPersistenceService.loadUser();
		if (user) {
			this.stateService.setUser(user);
		}
	}
}
