import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { EmailUniqueValidator } from './validators/email-unique-validator';

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
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  error$: Observable<string> = EMPTY;
  submitted = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly emailUniqueValidator: EmailUniqueValidator)
  {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.emailUniqueValidator]],
      password: ['', Validators.required]
    });
  }

  /**
   * Attempt to register the user
   */
  attemptRegistration(): void {
    this.submitted = true;
    if (this.form.valid) {
      const user$ = this.authenticationService.register({ user: this.form.value });
      this.error$ = user$.pipe(catchError(() => {
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
