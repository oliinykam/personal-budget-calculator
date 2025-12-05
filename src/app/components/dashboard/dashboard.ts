import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: number;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  recentTransactions: Transaction[] = [];
  categoryData: { label: string, value: number }[] = [];
  maxCategoryValue: number = 0;

  // Mock data
  private mockTransactions: Transaction[] = [
    { id: 1, date: new Date('2025-10-14'), description: 'Grocery Shopping', category: 'Food', amount: -85.50, type: 'expense' },
    { id: 2, date: new Date('2025-10-13'), description: 'Monthly Salary', category: 'Income', amount: 4200, type: 'income' },
    { id: 3, date: new Date('2025-10-12'), description: 'Uber Ride', category: 'Transport', amount: -15.00, type: 'expense' },
    { id: 4, date: new Date('2025-10-11'), description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, type: 'expense' },
    { id: 5, date: new Date('2025-10-10'), description: 'Electricity Bill', category: 'Utilities', amount: -120.00, type: 'expense' },
    { id: 6, date: new Date('2025-10-09'), description: 'Restaurant Dinner', category: 'Food', amount: -65.00, type: 'expense' },
    { id: 7, date: new Date('2025-10-08'), description: 'Gas Station', category: 'Transport', amount: -50.00, type: 'expense' },
    { id: 8, date: new Date('2025-10-05'), description: 'Freelance Project', category: 'Income', amount: 1040, type: 'income' }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Calculate totals
    this.totalIncome = this.mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = Math.abs(this.mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));

    this.balance = this.totalIncome - this.totalExpenses;

    // Get recent transactions
    this.recentTransactions = this.mockTransactions.slice(0, 5);

    // Calculate category data
    const expensesByCategory: { [key: string]: number } = {};
    this.mockTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount);
      });

    this.categoryData = Object.entries(expensesByCategory)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

    this.maxCategoryValue = Math.max(...this.categoryData.map(c => c.value));
  }

  getCategoryBadgeClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Food': 'badge-food',
      'Transport': 'badge-transport',
      'Entertainment': 'badge-entertainment',
      'Income': 'badge-salary',
      'Utilities': 'badge-utilities'
    };
    return classes[category] || 'badge-default';
  }

  getAmountClass(amount: number): string {
    return amount > 0 ? 'amount-positive' : 'amount-negative';
  }

  formatAmount(amount: number): string {
    const sign = amount > 0 ? '+' : '';
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  }
}