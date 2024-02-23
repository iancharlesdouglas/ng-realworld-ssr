import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { mockHttpClient, mockHttpHandler } from '../../shared/tests/mock-http-client';
import { mockIntersectionObserver } from '../../shared/tests/mock-intersection-observer';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeAll(() => {
    mockIntersectionObserver();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])} },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
