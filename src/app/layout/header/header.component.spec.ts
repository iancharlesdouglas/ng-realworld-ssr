import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a Home link', () => {
    const homeLink = fixture.debugElement.query(
      By.css('li:first-of-type a')
    ).nativeElement;
    expect(homeLink.textContent).toEqual('Home');
  });

  it('should show a Sign In and a Sign Up link if not logged in', () => {
    component.loggedIn = false;
    fixture.detectChanges();

    const signInLink = fixture.debugElement.query(
      By.css('li:nth-of-type(2) a')
    ).nativeElement;
    expect(signInLink.textContent).toEqual('Sign in');

    const signUpLink = fixture.debugElement.query(
      By.css('li:nth-of-type(3) a')
    ).nativeElement;
    expect(signUpLink.textContent).toEqual('Sign up');
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
