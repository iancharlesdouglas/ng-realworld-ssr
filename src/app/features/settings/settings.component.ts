import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserPersistenceService } from '../../shared/services/state/user-persistence.service';
import { Router } from '@angular/router';
import { StateService } from '../../shared/services/state/state.service';
import { SettingsService } from './services/settings.service';

/**
 * Component to change user settings, or log out
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  // TODO - form model
  constructor(
    private readonly settingsService: SettingsService,
    private readonly userPersistenceService: UserPersistenceService,
    private readonly stateService: StateService,
    private readonly router: Router)
  {}

  updateSettings(): void {

    // this.settingsService.updateSettings();
  }
  /**
   * Logs the user out and navigates to the home page
   */
  logOut(): void {
    this.userPersistenceService.forgetUser();
    this.stateService.setUser(undefined);
    this.router.navigate(['/']);
  }
}
