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
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR', 'USER'] },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR', 'USER'] },
  },
  {
    path: 'spaces',
    component: ParkingSpacesComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR'] },
  },
  {
    path: 'entry',
    component: EntryRegistrationComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR'] },
  },
  {
    path: 'exit',
    component: ExitRegistrationComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR'] },
  },
  {
    path: 'registration',
    component: UserRegistrationComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN'] },
  },
  {
    path: 'tariffs',
    component: TariffManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN'] },
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN'] },
  },
  {
    path: 'tickets',
    component: ActiveTicketsComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR'] },
  },
  {
    path: 'vehicles',
    component: VehiclesComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN', 'OPERADOR'] },
  },
  {
    path: 'billing',
    component: BillingConfigComponent,
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['ADMIN'] },
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
