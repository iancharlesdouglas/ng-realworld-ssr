import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../../../environments/environment';
import { RegisterUserRequest } from '../../services/model/register-user-request';
import { vi } from 'vitest';
import { ProfileService } from '../../../../shared/services/profile.service';
import { StateService } from '../../../../shared/services/state/state.service';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  const profileService = {
    find: vi.fn().mockReturnValue(of(null))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        { provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])} },
        { provide: AuthenticationService },
        { provide: ProfileService, useValue: profileService },
        { provide: StateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
  });

  it('requires valid username, email and password to be supplied', () => {
    let errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBe(0);

    const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBe(3);

    const usernameField = fixture.nativeElement.querySelector('input[formControlName=username]') as HTMLInputElement;
    const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
    const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;

    usernameField.value = 'username1';
    usernameField.dispatchEvent(new Event('input'));
    emailField.value = 'valid@email.com';
    emailField.dispatchEvent(new Event('input'));
    passwordField.value = 'somePassword123';
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBe(0);

    emailField.value = 'someinvalidemail.com';
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('passes expected values to expected URL when registering', () => {
    // @ts-expect-error mock method format
    mockHttpClient.post = vi.fn();
    fixture.detectChanges();
    const userRequest: RegisterUserRequest = {
      user: {
        username: 'username1',
        email: 'some@email.com',
        password: 'somePassword1234'
      }
    };
    const usernameField = fixture.nativeElement.querySelector('input[formControlName=username]') as HTMLInputElement;
    const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
    const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;
    const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;

    usernameField.value = userRequest.user.username;
    emailField.value = userRequest.user.email;
    passwordField.value = userRequest.user.password;
    usernameField.dispatchEvent(new Event('input'));
    emailField.dispatchEvent(new Event('input'));
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitButton.click();
    fixture.detectChanges();

    const expectedUrl = `${environment.remoteApiHost}/api/users`;
    expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, userRequest);
  });
});
