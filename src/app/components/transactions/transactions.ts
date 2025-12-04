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
  templateUrl: 'transactions.html',
  styleUrls: ['transactions.css']
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