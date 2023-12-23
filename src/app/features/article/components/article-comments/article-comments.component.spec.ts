import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCommentsComponent } from './article-comments.component';

describe('ArticleCommentsComponent', () => {
  let component: ArticleCommentsComponent;
  let fixture: ComponentFixture<ArticleCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCommentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
