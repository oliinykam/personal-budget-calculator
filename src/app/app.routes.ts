import { Routes } from '@angular/router';
import { TransactionsComponent } from './components/transactions/transactions';
import { BudgetsComponent } from './components/budgets/budgets';
import { ReportsComponent } from './components/reports/reports';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'transactions', component: TransactionsComponent },
    { path: 'budgets', component: BudgetsComponent },
    { path: 'reports', component: ReportsComponent }
];


