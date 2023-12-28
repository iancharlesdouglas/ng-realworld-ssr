import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { AuthenticationService } from "../services/authentication.service";
import { Observable, catchError, map, of } from "rxjs";
import { LoginUserRequest } from "../model/login-user-request";

@Injectable({ providedIn: 'root' })
export class LoginValidator implements AsyncValidator {
  constructor(private readonly authenticationService: AuthenticationService) {}

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    const email = control.parent?.get('email')?.value;
    const password = control.parent?.get('password')?.value;
    const user: LoginUserRequest = { user: { email, password } };
    return this.authenticationService.login(user).pipe(
      map(() => {
        return of(null);
      }),
      catchError(() => {
        return of({ loginFailed: true });
      }),
    );
  }
}
