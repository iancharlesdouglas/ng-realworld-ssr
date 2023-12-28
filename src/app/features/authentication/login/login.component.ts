import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Login screen
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  loginFailedCredentials = false;
  loginFailed = false;
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
    this.loginFailed = false;
    this.loginFailedCredentials = false;
    if (this.form.valid) {
      const user$ = this.authenticationService.login({ user: this.form.value });
      this.userSub = user$.pipe(catchError((error, caught) => {
        if (error.status === 403) {
          this.loginFailedCredentials = true;
        }
        this.loginFailed = true;
        return EMPTY;
      })).subscribe(() => (this.router.navigate(['/'])));
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
