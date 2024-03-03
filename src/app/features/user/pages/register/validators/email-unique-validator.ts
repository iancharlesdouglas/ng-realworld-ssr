/* eslint-disable unicorn/no-null */
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { ProfileService } from '../../../../../shared/services/profile.service';

/**
 * Validates whether an email address has already been taken
 */
@Injectable({ providedIn: 'root' })
export class EmailUniqueValidator implements AsyncValidator {
	constructor(private readonly profileService: ProfileService) {}

	validate(control: AbstractControl): Observable<ValidationErrors | null> {
		return this.profileService.find(`${control.value}`).pipe(
			catchError(() => of(null)),
			map(profile => (profile ? { emailTaken: true } : null)),
		);
	}
}
