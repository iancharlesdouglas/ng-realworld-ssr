import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { ActivatedRoute } from '@angular/router';
import { from, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthenticationService } from '../../services/authentication.service';
import { StateService } from '../../../../shared/services/state/state.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const stateService = new StateService();
  const authenticationService = new AuthenticationService(mockHttpClient, stateService);
  authenticationService.login = vi.fn().mockResolvedValue(of({username: 'x', email: 'x@x.com'}));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LoginComponent ],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        { provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])} },
        { provide: AuthenticationService, useValue: authenticationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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

    emailField.value = 'valid@email.com';
    emailField.dispatchEvent(new Event('input'));
    passwordField.value = 'somePassword123';
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    expect(authenticationService.login).toHaveBeenCalled();
  });

  it('presents an error message when login fails using the service', () => {
    authenticationService.login = vi.fn().mockReturnValue(throwError(() => '** DELIBERATE ERROR **'));
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

    expect(authenticationService.login).toHaveBeenCalled();
    const errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
    expect(errorMessages.length).toBeGreaterThan(0);
  });
});
