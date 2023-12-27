import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ArticleControlsComponent } from "./article-controls.component";
import { Article } from "../../../../shared/model/article";
import { DateTime } from "luxon";
import { of } from "rxjs";

describe('ArticleControlsComponent', () => {
  let component: ArticleControlsComponent;
  let fixture: ComponentFixture<ArticleControlsComponent>;

  const article: Article = {
    slug: 'article-id',
    title: 'Article Title',
    description: '',
    body: 'Article body',
    tagList: [],
    createdAt: DateTime.fromISO('2023-10-01').toJSDate(),
    updatedAt: DateTime.fromISO('2023-10-02').toJSDate(),
    favorited: true,
    favoritesCount: 1000,
    author: {
      username: 'Author-1',
      image: 'https://some-image-source/author-image.png',
      following: false
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleControlsComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleControlsComponent);
    component = fixture.componentInstance;
    component.article = article;
    fixture.detectChanges();
  });

  it('should render the follow and favorite article controls', () => {
    const followControl = fixture.nativeElement.querySelector('button.follow-control') as HTMLButtonElement;
    expect(followControl).toBeDefined();

    const favoriteControlCounter = fixture.nativeElement.querySelector('button.favorite-control span.counter') as HTMLSpanElement;
    expect(favoriteControlCounter).toBeDefined();
  });

  it('should render the edit and delete article controls if the current user is signed in', () => {
    // Not signed in
    let editControl = fixture.nativeElement.querySelector('button.edit-control') as HTMLButtonElement;
    expect(editControl).toBeFalsy();

    let deleteControl = fixture.nativeElement.querySelector('button.delete-control') as HTMLButtonElement;
    expect(deleteControl).toBeFalsy();

    // Signed in
    component.user$ = of({username: 'a@a.com', email: 'a@a.com', token: 'token_1'});
    fixture.detectChanges();

    editControl = fixture.nativeElement.querySelector('button.edit-control') as HTMLButtonElement;
    expect(editControl).toBeDefined();

    deleteControl = fixture.nativeElement.querySelector('button.delete-control') as HTMLButtonElement;
    expect(deleteControl).toBeDefined();
  });
});
