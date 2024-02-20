import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { from } from 'rxjs';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])} },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should retrieve an article with its comments', () => {
  //   throw 'not implemented';
  // });

  // it('should favorite an article when requested', () => {
  //   throw 'not implemented';
  // });

  // it('should unfavorite an article when requested', () => {
  //   throw 'not implemented';
  // });

  // it('should action following of an author when requested', () => {
  //   throw 'not implemented';
  // });
});
