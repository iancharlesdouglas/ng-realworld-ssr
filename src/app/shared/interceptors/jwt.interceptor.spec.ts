import { StateService } from '../services/state/state.service';
import { User } from '../model/user';
import { vi } from 'vitest';
import { HttpContext, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
	it('sets the Authorization token to that of the user from application state', async () => {
		vi.mock('@angular/core', () => {
			const user: User = { token: 'some_token', username: 'joe_bloggs25', email: 'joe@bloggs.com' };
			const stateService = new StateService();
			stateService.setUser(user);
			return {
				Injectable: vi.fn(),
				inject: vi.fn().mockReturnValue(stateService),
			};
		});
		const headers = new HttpHeaders();
		const context = new HttpContext();
		const parameters = new HttpParams();
		const url = 'https://blah.com';
		const request: HttpRequest<string> = {
			clone: vi.fn().mockImplementation(x => x),
			url,
			body: '',
			headers,
			context,
			method: 'GET',
			reportProgress: false,
			responseType: 'text',
			withCredentials: true,
			params: parameters,
			urlWithParams: url,
			serializeBody: vi.fn(),
			detectContentTypeHeader: vi.fn(),
		};
		const response = new HttpResponse<string>({ body: 'response' });
		const nextHandler = vi.fn().mockReturnValue(of(response));

		const response$ = jwtInterceptor(request, nextHandler);
		await firstValueFrom(response$);

		expect(request.clone).toHaveBeenCalledWith({ setHeaders: { Authorization: 'Token some_token' } });
	});
});
