import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mockIntersectionObserver } from './shared/tests/mock-intersection-observer';
import { StateService } from './shared/services/state/state.service';

describe('AppComponent', () => {
	beforeAll(() => {
		mockIntersectionObserver();
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [
				{ provide: ActivatedRoute, useValue: { params: from([{ id: 'x' }]) } },
				{ provide: StateService, useValue: new StateService() },
			],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
