import { UserPersistenceService } from './../../../../shared/services/state/user-persistence.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { StateService } from '../../../../shared/services/state/state.service';
import { SettingsWithoutPassword } from './model/settings-without-password';
import { SettingsWithPassword } from './model/settings-with-password';
import { environment } from '../../../../../environments/environment';
import { vi } from 'vitest';

describe('SettingsComponent', () => {
	let fixture: ComponentFixture<SettingsComponent>;
	const stateService = new StateService();
	const userPersistenceService = new UserPersistenceService(stateService, {});
	const router = {
		navigate: vi.fn(),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SettingsComponent],
			providers: [
				{ provide: HttpClient, useValue: mockHttpClient },
				{ provide: HttpHandler, useValue: mockHttpHandler },
				{ provide: ActivatedRoute, useValue: { params: from([{ id: 'x' }]) } },
				{ provide: StateService, useValue: stateService },
				{ provide: Router, useValue: router },
				{ provide: UserPersistenceService, useValue: userPersistenceService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsComponent);
		fixture.detectChanges();
	});

	it('requires valid username and email to be supplied', () => {
		const usernameField = fixture.nativeElement.querySelector('input[formControlName=username]') as HTMLInputElement;
		usernameField.value = '';
		usernameField.dispatchEvent(new Event('input'));

		let errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
		expect(errorMessages.length).toBe(0);

		const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
		submitButton.click();
		fixture.detectChanges();

		errorMessages = fixture.nativeElement.querySelectorAll('ul.error-messages li') as HTMLLIElement[];
		expect(errorMessages.length).toBe(2);

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

	it('updates settings using the back end but does not submit password if password field is not filled in', () => {
		mockHttpClient.put = vi.fn().mockReturnValue(of({ user: {} }));
		fixture.detectChanges();
		const settingsWithoutPassword: SettingsWithoutPassword = {
			user: {
				username: 'username1',
				email: 'some@email.com',
				bio: 'My biography',
				image: 'https://some-image-service.com/my-image.png',
			},
		};

		const usernameField = fixture.nativeElement.querySelector('input[formControlName=username]') as HTMLInputElement;
		const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
		const bioField = fixture.nativeElement.querySelector('textarea[formControlName=bio]') as HTMLTextAreaElement;
		const imageField = fixture.nativeElement.querySelector('input[formControlName=image]') as HTMLInputElement;
		const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;

		usernameField.value = settingsWithoutPassword.user.username;
		emailField.value = settingsWithoutPassword.user.email;
		bioField.value = settingsWithoutPassword.user.bio!;
		imageField.value = settingsWithoutPassword.user.image!;

		usernameField.dispatchEvent(new Event('input'));
		emailField.dispatchEvent(new Event('input'));
		bioField.dispatchEvent(new Event('input'));
		imageField.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		submitButton.click();
		fixture.detectChanges();

		const expectedUrl = `${environment.remoteApiHost}/api/user`;
		expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, settingsWithoutPassword);
	});

	it('updates settings using the back end including password if password field is filled in', () => {
		mockHttpClient.put = vi.fn().mockReturnValue(of({ user: {} }));
		fixture.detectChanges();
		const settingsWithPassword: SettingsWithPassword = {
			user: {
				username: 'username1',
				email: 'some@email.com',
				bio: 'My biography',
				image: 'https://some-image-service.com/my-image.png',
				password: 'password123',
			},
		};

		const usernameField = fixture.nativeElement.querySelector('input[formControlName=username]') as HTMLInputElement;
		const emailField = fixture.nativeElement.querySelector('input[formControlName=email]') as HTMLInputElement;
		const bioField = fixture.nativeElement.querySelector('textarea[formControlName=bio]') as HTMLTextAreaElement;
		const imageField = fixture.nativeElement.querySelector('input[formControlName=image]') as HTMLInputElement;
		const passwordField = fixture.nativeElement.querySelector('input[formControlName=password]') as HTMLInputElement;
		const submitButton = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;

		usernameField.value = settingsWithPassword.user.username;
		emailField.value = settingsWithPassword.user.email;
		bioField.value = settingsWithPassword.user.bio!;
		imageField.value = settingsWithPassword.user.image!;

		usernameField.dispatchEvent(new Event('input'));
		emailField.dispatchEvent(new Event('input'));
		bioField.dispatchEvent(new Event('input'));
		imageField.dispatchEvent(new Event('input'));
		passwordField.value = settingsWithPassword.user.password;
		passwordField.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		const expectedUrl = `${environment.remoteApiHost}/api/user`;

		submitButton.click();
		fixture.detectChanges();

		expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, settingsWithPassword);
	});

	it('logs user out when logout button is clicked', () => {
		userPersistenceService.forgetUser = vi.fn();
		stateService.setUser = vi.fn();
		fixture.detectChanges();

		const logoutButton = fixture.nativeElement.querySelector('#logout-button') as HTMLButtonElement;

		logoutButton.click();
		fixture.detectChanges();

		expect(userPersistenceService.forgetUser).toHaveBeenCalled();
		expect(stateService.setUser).toHaveBeenCalledWith(undefined);
		expect(router.navigate).toHaveBeenCalledWith(['/']);
	});
});
