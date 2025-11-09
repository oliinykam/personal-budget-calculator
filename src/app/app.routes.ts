import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TransactionsComponent } from './components/transactions/transactions';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'transactions', component: TransactionsComponent }
];
