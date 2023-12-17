import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./features/home/home.component').then(comp => comp.HomeComponent),
  },
  {
    path: 'article/:id', loadComponent: () => import('./features/article/article.component').then(comp => comp.ArticleComponent)
  }
];
