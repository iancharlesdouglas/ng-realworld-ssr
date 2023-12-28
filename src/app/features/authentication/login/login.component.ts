import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { EMPTY, ReplaySubject, Subscription, catchError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Login screen
 */
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  loginErrors$ = new ReplaySubject<string>();
  private userSub: Subscription | undefined;

  constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router, private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Tries to log in
   */
  attemptLogin(): void {
    this.submitted = true;
    if (this.form.valid) {
      const user$ = this.authenticationService.login({ user: this.form.value });
      this.userSub = user$.pipe(catchError((error, caught) => {
        if (error.status === 403) {
          this.loginErrors$.next('Sign in failed (are your email and password correct)?');
        } else {
          this.loginErrors$.next('A problem occurred while signing you in');
        }
        return EMPTY;
      })).subscribe(() => (this.router.navigate(['/'])));
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
