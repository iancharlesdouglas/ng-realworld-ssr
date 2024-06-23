import { ApplicationConfig, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { StateService } from './shared/services/state/state.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(),
		provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000',
		}),
		provideExperimentalZonelessChangeDetection(),
		[{ provide: StateService, useFactory: () => new StateService() }],
	],
};
