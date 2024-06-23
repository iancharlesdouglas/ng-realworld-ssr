import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { FromPage } from '../../../../shared/model/from-page';

/**
 * Login page
 */
@Component({
	selector: 'app-login',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AsyncPipe, ReactiveFormsModule, FormsModule, RouterLink],
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
	form!: FormGroup;
	error$: Observable<string> = EMPTY;
	submitted = false;
	fromPage: FromPage | undefined;

	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly router: Router,
		private readonly formBuilder: FormBuilder,
	) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});
		this.fromPage = history?.state;
	}

	/**
	 * Attempt to log in the user
	 */
	attemptLogin(): void {
		this.submitted = true;
		if (this.form.valid) {
			const user$ = this.authenticationService.login({ user: this.form.value });
			this.error$ = user$.pipe(
				catchError(error => {
					if (error.status === 403) {
						return of('Sign in failed (are your email and password correct)?');
					}
					return of('A problem occurred while signing you in');
				}),
				tap(result => {
					if (typeof result !== 'string') {
						if (this.fromPage) {
							const { url, queryParams } = this.fromPage;
							if (url && queryParams && url.length > 0) {
								this.router.navigate(
									url.map(segment => segment.path),
									{ queryParams },
								);
							} else {
								this.router.navigate(['/']);
							}
						} else {
							this.router.navigate(['/']);
						}
					}
				}),
				map(result => result as string),
			);
		}
	}
}
