import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UserPersistenceService } from '../../shared/services/state/user-persistence.service';
import { Router } from '@angular/router';
import { StateService } from '../../shared/services/state/state.service';
import { SettingsService } from './services/settings.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Observable, Subscription, catchError, map, of, tap } from 'rxjs';
import { UserResponse } from '../../shared/model/user-response';
import { AsyncPipe } from '@angular/common';
import { SettingsWithPassword } from './model/settings-with-password';
import { SettingsWithoutPassword } from './model/settings-without-password';

/**
 * Component to change user settings, or log out
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  errors$: Observable<string> = EMPTY;
  submitted = false;
  private userSub: Subscription | undefined;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly userPersistenceService: UserPersistenceService,
    private readonly stateService: StateService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder)
  {}

  ngOnInit(): void {
    this.userSub = this.stateService.user$.subscribe(user => {
      this.form = this.formBuilder.group({
        email: [user?.email || '', [Validators.required, Validators.email]],
        username: [user?.username || '', Validators.required],
        bio: [user?.bio || ''],
        image: [user?.image || ''],
        password: ['']
      });
    });
  }
  /**
   * Updates settings on the back end
   */
  updateSettings(): void {
    this.submitted = true;
    if (this.form.valid) {
      let settings: SettingsWithPassword | SettingsWithoutPassword;
      if (this.form.get('password')?.value) {
        settings = {
          user: this.form.value
        };
      } else {
        settings = {
          user: {
            email: this.form.get('email')?.value,
            username: this.form.get('username')?.value,
            bio: this.form.get('bio')?.value,
            image: this.form.get('image')?.value
          }
        } as SettingsWithoutPassword;
      }
      const userResponse$ = this.settingsService.updateSettings(settings);
      this.errors$ = userResponse$.pipe(catchError(error => {
        this.submitted = false;
        return of('A problem occurred while updating the settings');
      }),
      tap(result => {
        if (typeof result !== 'string') {
          const userResponse = result as UserResponse;
          this.stateService.setUser(userResponse.user);
          this.router.navigate(['/']);
        }
        this.submitted = false;
      }),
      map(result => result as string));
    }
  }
  /**
   * Logs the user out and navigates to the home page
   */
  logOut(): void {
    this.userPersistenceService.forgetUser();
    this.stateService.setUser(undefined);
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
