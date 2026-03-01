import { Routes } from '@angular/router';
import { ApiDocsComponent } from './api-docs/api-docs';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'docs', component: ApiDocsComponent },
  { path: 'spaces', component: ParkingSpacesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
