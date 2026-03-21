import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces';
import { EntryRegistrationComponent } from './entry-registration/entry-registration';
import { UserRegistrationComponent } from './user-registration/user-registration';
import { TariffManagementComponent } from './tariff-management/tariff-management';
import { HistoryComponent } from './home/history';
import { ActiveTicketsComponent } from './active-tickets/active-tickets';
import { VehiclesComponent } from './active-tickets/vehicles';
import { ExitRegistrationComponent } from './exit/exit';
import { BillingConfigComponent } from './billing-config/billing-config';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'spaces', component: ParkingSpacesComponent },
  { path: 'entry', component: EntryRegistrationComponent },
  { path: 'exit', component: ExitRegistrationComponent },
  { path: 'registration', component: UserRegistrationComponent },
  { path: 'tariffs', component: TariffManagementComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'tickets', component: ActiveTicketsComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'billing', component: BillingConfigComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
