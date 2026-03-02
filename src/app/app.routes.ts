import { Routes } from '@angular/router';
import { ApiDocsComponent } from './api-docs/api-docs';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces';
import { EntryRegistrationComponent } from './entry-registration/entry-registration';
import { ExitRegistrationComponent } from './exit-registration/exit-registration';
import { UserRegistrationComponent } from './user-registration/user-registration';
import { TariffManagementComponent } from './tariff-management/tariff-management';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'docs', component: ApiDocsComponent },
  { path: 'spaces', component: ParkingSpacesComponent },
  { path: 'entry', component: EntryRegistrationComponent },
  { path: 'exit', component: ExitRegistrationComponent },
  { path: 'registration', component: UserRegistrationComponent },
  { path: 'tariffs', component: TariffManagementComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
