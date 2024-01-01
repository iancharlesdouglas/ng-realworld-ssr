import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable, catchError, map, of } from "rxjs";
import { ProfileService } from "../../../../../shared/services/profile.service";

/**
 * Validates whether an email address has already been taken
 */
@Injectable({ providedIn: 'root' })
export class EmailUniqueValidator implements AsyncValidator {
  constructor(private readonly profileService: ProfileService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    return this.profileService.find(email).pipe(
      catchError(() => of(null)),
      map(profile => {
        return profile ? { emailTaken: true } : null;
      })
    );
  }
}
