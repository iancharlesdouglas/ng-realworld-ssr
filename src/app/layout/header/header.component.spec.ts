import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { Subject, from } from 'rxjs';
import { Event, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	const router = {
		events: new Subject<Event>(),
		createUrlTree: vi.fn(),
		serializeUrl: vi.fn(),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent],
			providers: [
				{ provide: Router, useValue: router },
				{ provide: ActivatedRoute, useValue: { params: from([{ id: 'x' }]) } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have a Home link', () => {
		const homeLink = fixture.debugElement.query(By.css('li:first-of-type a')).nativeElement;
		expect(homeLink.textContent).toEqual('Home');
	});

	it('should show a Sign In and a Sign Up link if not logged in', () => {
		component.loggedIn = false;
		fixture.detectChanges();

		const signInLink = fixture.debugElement.query(By.css('li:nth-of-type(2) a')).nativeElement;
		expect(signInLink.textContent).toEqual('Sign in');

		const signUpLink = fixture.debugElement.query(By.css('li:nth-of-type(3) a')).nativeElement;
		expect(signUpLink.textContent).toEqual('Sign up');
	});

	it('highlights the relevant link as active when on that page', () => {
		router.events.next(new NavigationEnd(0, '/', ''));
		fixture.detectChanges();

		const homeLink = fixture.nativeElement.querySelector('a.nav-link:first-of-type.active') as HTMLAnchorElement;
		expect(homeLink).toBeDefined();

		router.events.next(new NavigationEnd(1, '/login', ''));
		fixture.detectChanges();

		const loginLink = fixture.nativeElement.querySelector('a.nav-link:nth-of-type(1).active') as HTMLAnchorElement;
		expect(loginLink).toBeDefined();

		router.events.next(new NavigationEnd(1, '/register', ''));
		fixture.detectChanges();

		const registerLink = fixture.nativeElement.querySelector('a.nav-link:nth-of-type(2).active') as HTMLAnchorElement;
		expect(registerLink).toBeDefined();
	});

	// it('should show a New Article, Settings and a Profile link if logged in', () => {
	//   component.loggedIn = true;
	//   fixture.detectChanges();

	//   const newArticleLink = fixture.debugElement.query(
	//     By.css('li:nth-of-type(2) a')
	//   ).nativeElement;
	//   expect(newArticleLink.textContent.trim()).toEqual('New Article');

	//   const settingsLink = fixture.debugElement.query(
	//     By.css('li:nth-of-type(3) a')
	//   ).nativeElement;
	//   expect(settingsLink.textContent.trim()).toEqual('Settings');

	//   const profileLink = fixture.debugElement.query(
	//     By.css('li:nth-of-type(4) a')
	//   ).nativeElement;
	//   expect(profileLink).toBeDefined();
	// });
});
