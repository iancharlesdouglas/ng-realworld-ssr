import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { ActivatedRoute } from '@angular/router';
import { from, throwError } from 'rxjs';
import { expect, vi } from 'vitest';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginUserRequest } from '../../services/model/login-user-request';
import { environment } from '../../../../../environments/environment';
import { StateService } from '../../../../shared/services/state/state.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LoginComponent ],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        { provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])} },
        { provide: AuthenticationService },
        { provide: StateService }
      ]
    })
    .compileComponents();

    // @ts-expect-error mock method format
    mockHttpClient.post = vi.fn();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('requires valid email and password to be supplied', () => {
    let errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBe(0);

    const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
    const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;

    emailField.value = 'invalidemail';
    emailField.dispatchEvent(new Event('input'));
    passwordField.value = 'somePassword123';
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBeGreaterThan(0);

    emailField.value = 'some@validemail.com';
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBe(0);

    passwordField.value = '';
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBeGreaterThan(0);

    passwordField.value = 'apassWord123';
    passwordField.dispatchEvent(new Event('input'));
    emailField.value = '';
    emailField.dispatchEvent(new Event('input'));

    errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('logs in with the service if valid email and password are supplied', () => {
    const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
    const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;
    const userRequest: LoginUserRequest = {
      user: {
        email: 'some@email.com',
        password: 'somePassword1234'
      }
    };

    emailField.value = userRequest.user.email;
    emailField.dispatchEvent(new Event('input'));
    passwordField.value = userRequest.user.password;
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    expect(mockHttpClient.post).toHaveBeenCalledWith(expect.anything(), userRequest);
  });

  it('presents an error message when login fails using the service', () => {
    mockHttpClient.post = vi.fn().mockReturnValue(throwError(() => '** DELIBERATE ERROR **'));
    const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
    const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;

    emailField.value = 'valid@email.com';
    emailField.dispatchEvent(new Event('input'));
    passwordField.value = 'somePassword123';
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    expect(mockHttpClient.post).toHaveBeenCalled();
    const errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('passes expected values to expected URL when logging in', () => {
    fixture.detectChanges();
    const userRequest: LoginUserRequest = {
      user: {
        email: 'some@email.com',
        password: 'somePassword1234'
      }
    };
    const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
    const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;
    const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;

    emailField.value = userRequest.user.email;
    passwordField.value = userRequest.user.password;
    emailField.dispatchEvent(new Event('input'));
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitButton.click();
    fixture.detectChanges();

    const expectedUrl = `${environment.remoteApiHost}/api/users/login`;
    expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, userRequest);
  });
});
