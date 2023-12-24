import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./features/home/home.component').then(comp => comp.HomeComponent),
  },
  {
    path: 'article/:id', loadComponent: () => import('./features/article/article.component').then(comp => comp.ArticleComponent)
  },
  {
    path: 'login', loadComponent: () => import('./features/authentication/login/login.component').then(comp => comp.LoginComponent)
  },
  {
    path: 'register', loadComponent: () => import('./features/authentication/register/register.component').then(comp => comp.RegisterComponent)
  }
];
