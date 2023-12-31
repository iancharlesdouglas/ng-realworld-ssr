import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        { provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
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
});
