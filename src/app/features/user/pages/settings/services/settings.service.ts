import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsWithPassword } from '../model/settings-with-password';
import { HttpClient } from '@angular/common/http';
import { SettingsWithoutPassword } from '../model/settings-without-password';
import { UserResponse } from '../../../../../shared/model/api/user-response';
import { environment } from '../../../../../../environments/environment';

/**
 * Settings service which saves settings to the back end
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
	constructor(private readonly http: HttpClient) {}

	/**
	 * Updates the given settings
	 * @param settings Settings to update
	 * @returns User response from service
	 */
	updateSettings(settings: SettingsWithPassword | SettingsWithoutPassword): Observable<UserResponse> {
		const url = `${environment.remoteApiHost}/api/user`;
		return this.http.put<UserResponse>(url, settings);
	}
}
