import { Routes } from '@angular/router';
import { ApiDocsComponent } from './api-docs/api-docs';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'docs', component: ApiDocsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
