import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: number;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <!-- Filters Section -->
      <div class="filters">
        <div class="filter-group">
          <label>Search</label>
          <input 
            type="text" 
            placeholder="Search transactions..." 
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()">
        </div>
        <div class="filter-group">
          <label>Category</label>
          <select 
            [(ngModel)]="selectedCategory"
            (ngModelChange)="applyFilters()">
            <option value="all">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>Date From</label>
          <input 
            type="date" 
            [(ngModel)]="dateFrom"
            (ngModelChange)="applyFilters()"
            placeholder="Select date">
        </div>
        <div class="filter-group">
          <label>Date To</label>
          <input 
            type="date" 
            [(ngModel)]="dateTo"
            (ngModelChange)="applyFilters()"
            placeholder="Select date">
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="transactions-table">
        <div class="table-header">
          <h2>All Transactions ({{ filteredTransactions.length }})</h2>
          <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
            {{ showAddForm ? '✕ Cancel' : '+ Add New' }}
          </button>
        </div>

        <!-- Add Transaction Form -->
        <div class="add-form" *ngIf="showAddForm">
          <h3>Add New Transaction</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Description</label>
              <input type="text" [(ngModel)]="newTransaction.description" placeholder="Enter description">
            </div>
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="newTransaction.category">
                <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount</label>
              <input type="number" [(ngModel)]="newTransaction.amount" placeholder="0.00" step="0.01">
            </div>
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="newTransaction.type">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="newTransaction.date">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-success" (click)="addTransaction()">Add Transaction</button>
            <button class="btn btn-secondary" (click)="showAddForm = false">Cancel</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of filteredTransactions">
              <td>{{ transaction.date | date: 'MMM d, yyyy' }}</td>
              <td>{{ transaction.description }}</td>
              <td>
                <span class="badge" [ngClass]="getCategoryBadgeClass(transaction.category)">
                  {{ transaction.category }}
                </span>
              </td>
              <td [ngClass]="getAmountClass(transaction.amount)">
                {{ formatAmount(transaction.amount) }}
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-edit btn-small" (click)="editTransaction(transaction)">
                    Edit
                  </button>
                  <button class="btn btn-delete btn-small" (click)="deleteTransaction(transaction.id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredTransactions.length === 0">
              <td colspan="5" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                No transactions found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 2rem;
    }
    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    .filter-group label {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #7f8c8d;
      font-weight: 500;
    }
    .filter-group input, .filter-group select {
      width: 95%;
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: border-color 0.3s;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .filter-group input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
    }

    .filter-group input[type="date"] {
      color: #2c3e50;
    }

    .filter-group input[type="date"]:invalid {
      color: #95a5a6;
    }
    .filter-group input:focus, .filter-group select:focus {
      outline: none;
      border-color: #3498db;
    }
    .transactions-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .table-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ecf0f1;
    }
    .table-header h2 {
      font-size: 1.2rem;
      margin: 0;
    }
    .add-form {
      padding: 1.5rem;
      background: #f8f9fa;
      border-bottom: 1px solid #ecf0f1;
    }
    .add-form h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
      font-size: 1.1rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group label {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #7f8c8d;
      font-weight: 500;
    }
    .form-group input, .form-group select {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #3498db;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    .btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      font-weight: 500;
    }
    .btn-primary {
      background: #3498db;
      color: white;
    }
    .btn-primary:hover {
      background: #2980b9;
    }
    .btn-success {
      background: #27ae60;
      color: white;
    }
    .btn-success:hover {
      background: #229954;
    }
    .btn-secondary {
      background: #95a5a6;
      color: white;
    }
    .btn-secondary:hover {
      background: #7f8c8d;
    }
    .btn-small {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }
    .btn-edit {
      background: #3498db;
      color: white;
    }
    .btn-edit:hover {
      background: #2980b9;
    }
    .btn-delete {
      background: #e74c3c;
      color: white;
    }
    .btn-delete:hover {
      background: #c0392b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead {
      background: #f8f9fa;
    }
    th, td {
      padding: 1rem 1.5rem;
      text-align: left;
    }
    th {
      font-weight: 600;
      color: #7f8c8d;
      font-size: 0.85rem;
      text-transform: uppercase;
    }
    tbody tr {
      border-bottom: 1px solid #ecf0f1;
      transition: background 0.2s;
    }
    tbody tr:hover {
      background: #f8f9fa;
    }
    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }
    .amount-positive {
      color: #27ae60;
      font-weight: 600;
    }
    .amount-negative {
      color: #e74c3c;
      font-weight: 600;
    }
    .badge {
      padding: 0.3rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      display: inline-block;
    }
    .badge-food { background: #ffe5e5; color: #e74c3c; }
    .badge-transport { background: #e3f2fd; color: #2196f3; }
    .badge-entertainment { background: #f3e5f5; color: #9c27b0; }
    .badge-income { background: #e8f5e9; color: #4caf50; }
    .badge-utilities { background: #fff3e0; color: #ff9800; }
    .badge-default { background: #e0e0e0; color: #757575; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = 'all';
  dateFrom: string = '';
  dateTo: string = '';
  showAddForm: boolean = false;

  categories: string[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Income'];

  newTransaction = {
    description: '',
    category: 'Food',
    amount: 0,
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  };

  private mockTransactions: Transaction[] = [
    { id: 1, date: new Date('2025-11-07'), description: 'Grocery Shopping', category: 'Food', amount: -85.50, type: 'expense' },
    { id: 2, date: new Date('2025-11-06'), description: 'Monthly Salary', category: 'Income', amount: 4200, type: 'income' },
    { id: 3, date: new Date('2025-11-05'), description: 'Uber Ride', category: 'Transport', amount: -15.00, type: 'expense' },
    { id: 4, date: new Date('2025-11-04'), description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, type: 'expense' },
    { id: 5, date: new Date('2025-11-03'), description: 'Electricity Bill', category: 'Utilities', amount: -120.00, type: 'expense' },
    { id: 6, date: new Date('2025-11-02'), description: 'Restaurant Dinner', category: 'Food', amount: -65.00, type: 'expense' },
    { id: 7, date: new Date('2025-11-01'), description: 'Gas Station', category: 'Transport', amount: -50.00, type: 'expense' },
    { id: 8, date: new Date('2025-10-30'), description: 'Freelance Project', category: 'Income', amount: 800, type: 'income' },
    { id: 9, date: new Date('2025-10-28'), description: 'Coffee Shop', category: 'Food', amount: -12.50, type: 'expense' },
    { id: 10, date: new Date('2025-10-25'), description: 'Movie Tickets', category: 'Entertainment', amount: -35.00, type: 'expense' }
  ];

  ngOnInit(): void {
    this.transactions = [...this.mockTransactions];
    this.filteredTransactions = [...this.transactions];
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || t.category === this.selectedCategory;
      
      let matchesDate = true;
      if (this.dateFrom) {
        matchesDate = matchesDate && new Date(t.date) >= new Date(this.dateFrom);
      }
      if (this.dateTo) {
        matchesDate = matchesDate && new Date(t.date) <= new Date(this.dateTo);
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }

  addTransaction(): void {
    if (!this.newTransaction.description || this.newTransaction.amount === 0) {
      alert('Please fill in all fields');
      return;
    }

    const transaction: Transaction = {
      id: Math.max(...this.transactions.map(t => t.id), 0) + 1,
      date: new Date(this.newTransaction.date),
      description: this.newTransaction.description,
      category: this.newTransaction.category,
      amount: this.newTransaction.type === 'expense' ? -Math.abs(this.newTransaction.amount) : Math.abs(this.newTransaction.amount),
      type: this.newTransaction.type
    };

    this.transactions.unshift(transaction);
    this.applyFilters();
    
    this.newTransaction = {
      description: '',
      category: 'Food',
      amount: 0,
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    };
    this.showAddForm = false;
  }

  editTransaction(transaction: Transaction): void {
    alert(`Edit functionality for: ${transaction.description}`);
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.applyFilters();
    }
  }

  getCategoryBadgeClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Food': 'badge-food',
      'Transport': 'badge-transport',
      'Entertainment': 'badge-entertainment',
      'Income': 'badge-income',
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