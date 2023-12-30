import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../shared/model/user-response';
import { SettingsWithPassword } from '../model/settings-with-password';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SettingsWithoutPassword } from '../model/settings-without-password';

/**
 * Settings service which saves settings to the back end
 */
@Injectable({providedIn: 'root'})
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
