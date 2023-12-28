import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginValidator } from '../validators/login-validator';

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
  private userSub: Subscription | undefined;

  constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router, private readonly loginValidator: LoginValidator) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', {
        asyncValidators: this.loginValidator.validate.bind(this.loginValidator),
        validators: Validators.required,
        updateOn: 'blur' })
    });
    new FormControl()
  }

  checkForm(): void {
    this.submitted = true;
    if (this.form.valid) {
      const user$ = this.authenticationService.login({ user: this.form.value });
      this.userSub = user$.subscribe(() => (this.router.navigate(['/'])));
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
