import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from './services/settings.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Observable, Subscription, catchError, map, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsWithPassword } from './model/settings-with-password';
import { SettingsWithoutPassword } from './model/settings-without-password';
import { UserPersistenceService } from '../../../../shared/services/state/user-persistence.service';
import { StateService } from '../../../../shared/services/state/state.service';
import { UserResponse } from '../../../../shared/model/api/user-response';

/**
 * User settings page, where user may also log out
 */
@Component({
	selector: 'app-settings',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AsyncPipe, FormsModule, ReactiveFormsModule],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
	form!: FormGroup;
	errors$: Observable<string> = EMPTY;
	submitted = false;
	private userSub: Subscription | undefined;

	constructor(
		private readonly settingsService: SettingsService,
		private readonly userPersistenceService: UserPersistenceService,
		private readonly stateService: StateService,
		private readonly router: Router,
		private readonly formBuilder: FormBuilder,
	) {}

	ngOnInit(): void {
		this.userSub = this.stateService.user$.subscribe(user => {
			this.form = this.formBuilder.group({
				email: [user?.email || '', [Validators.required, Validators.email]],
				username: [user?.username || '', Validators.required],
				bio: [user?.bio || ''],
				image: [user?.image || ''],
				password: [''],
			});
		});
	}

	/**
	 * Updates settings on the back end
	 */
	updateSettings(): void {
		this.submitted = true;
		if (this.form.valid) {
			const settings: SettingsWithPassword | SettingsWithoutPassword = this.form.get('password')?.value
				? {
						user: this.form.value,
					}
				: ({
						user: {
							email: this.form.get('email')?.value,
							username: this.form.get('username')?.value,
							bio: this.form.get('bio')?.value,
							image: this.form.get('image')?.value,
						},
					} as SettingsWithoutPassword);
			const userResponse$ = this.settingsService.updateSettings(settings);
			this.errors$ = userResponse$.pipe(
				catchError(() => {
					this.submitted = false;
					return of('A problem occurred while updating the settings');
				}),
				tap(result => {
					if (typeof result !== 'string') {
						const userResponse = result as UserResponse;
						this.stateService.setUser(userResponse.user);
						this.router.navigate(['/']);
					}
					this.submitted = false;
				}),
				map(result => result as string),
			);
		}
	}

	/**
	 * Logs the user out and navigates to the home page
	 */
	logOut(): void {
		this.userPersistenceService.forgetUser();
		this.stateService.setUser(undefined);
		this.router.navigate(['/']);
	}

	ngOnDestroy(): void {
		this.userSub?.unsubscribe();
	}
}
