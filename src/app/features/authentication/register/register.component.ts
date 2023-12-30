import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Registration page
 */
@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form!: FormGroup;
  error$: Observable<string> = EMPTY;
  submitted = false;

  constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router, private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Attempt to register the user
   */
  attemptRegistration(): void {
    this.submitted = true;
    if (this.form.valid) {
      const user$ = this.authenticationService.login({ user: this.form.value });
      this.error$ = user$.pipe(catchError(error => {
        // That email is already taken
        return of('A problem occurred while registering you');
      }), tap(result => {
        if (typeof result !== 'string') {
          this.router.navigate(['/']);
        }
      }),
      map(result => result as string));
    }
  }
}
