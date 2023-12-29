import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../shared/model/user-response';
import { Settings } from '../model/settings';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

/**
 * Settings service which saves settings to the back end
 */
@Injectable()
export class SettingsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Updates the given settings
   * @param settings Settings
   * @returns User response from service
   */
  updateSettings(settings: Settings): Observable<UserResponse> {
    const url = `${environment.remoteApiHost}/api/user`;
    return this.http.put<UserResponse>(url, settings);
  }
}
