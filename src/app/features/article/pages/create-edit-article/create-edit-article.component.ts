import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Observable, ReplaySubject, Subscription, combineLatest, concatAll, firstValueFrom, map, of } from 'rxjs';
import { ArticleService } from '../../../../shared/services/article.service';
import { CreateEditArticle } from '../../../../shared/model/create-edit-article';
import { StateService } from '../../../../shared/services/state/state.service';
import { AsyncPipe } from '@angular/common';
import { EMPTY_ARTICLE } from '../../../../shared/model/empty-article';

/**
 * Create/edit article page
 */
@Component({
  selector: 'app-create-edit-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './create-edit-article.component.html',
  styleUrl: './create-edit-article.component.scss'
})
export class CreateEditArticleComponent implements OnDestroy {
  form!: FormGroup;
  error$: Observable<string> = EMPTY;
  article: CreateEditArticle = EMPTY_ARTICLE;
  tagCount = 0;
  tags = new ReplaySubject<string[]>();
  submitted = false;
  private articleSub: Subscription;
  private articleSlug: string | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly articleService: ArticleService,
    private readonly stateService: StateService)
  {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      body: ['', Validators.required],
      tag: ''
    });

    this.articleSub = combineLatest([this.activatedRoute.params, this.stateService.user$]).pipe(
      map(([params]) => {
        this.articleSlug = params['id'];
        if (this.articleSlug) {
          return this.articleService.getArticle(this.articleSlug);
        } else {
          return of(EMPTY_ARTICLE)
        }
      }),
      concatAll(),
      map(article => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList
      } as CreateEditArticle)),
      ).subscribe(article => {
        this.article = article;
        this.form?.patchValue({
          ...article,
          body: article.body.replaceAll('\\n', '  \n'),
          tag: ''
        });
        this.tags.next(article.tagList);
      });
  }

  ngOnDestroy(): void {
    this.articleSub?.unsubscribe();
  }

  /**
   * Handles tag deletion
   * @param tag Tag
   */
  async removeTag(tag: string): Promise<void> {
    const withTagRemoved = {...this.article, tagList: this.article!.tagList.filter(existTag => existTag !== tag)} as CreateEditArticle;
    this.article = withTagRemoved;
    this.tags.next(this.article.tagList);
  }

  /**
   * Handles tag addition
   * @param event Keyboard event
   */
  async addTag(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter' || event.key === 'NumpadEnter' || event.key === ' ') {
      const tag = this.form.get('tag')!.value.trim();
      const withTagAdded = {...this.article, tagList: [...this.article!.tagList.filter(existTag => existTag !== tag), tag]} as CreateEditArticle;
      this.article = withTagAdded;
      this.tags.next(this.article.tagList);
      this.form.patchValue({tag: ''});
    }
  }

  /**
   * Attempt to publish the article, and show it as published once successful
   */
  async attemptPublish(): Promise<void> {
    this.submitted = true;
    if (this.form.valid) {
      this.article = {
        title: this.form.get('title')?.value?.trim(),
        description: this.form.get('description')?.value.trim(),
        body: this.form.get('body')?.value?.trim(),
        tagList: this.article.tagList,
        slug: this.articleSlug || ''
      };
      if (this.article?.slug) {
        this.article = await firstValueFrom(this.articleService.updateArticle(this.article));
      } else {
        this.article = await firstValueFrom(this.articleService.createArticle(this.article));
      }
      this.router.navigate(['/article', this.article?.slug]);
    }
  }
}
