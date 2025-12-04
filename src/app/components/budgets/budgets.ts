import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Budget {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  icon: string;
}

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'budgets.html',
  styleUrls: ['budgets.css']
})

export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  showAddForm: boolean = false;

  newBudget = {
    category: '',
    budgetAmount: 0,
    icon: '💰'
  };

  private mockBudgets: Budget[] = [
    { id: 1, category: 'Food & Groceries', budgetAmount: 600, spentAmount: 520, icon: '🍔' },
    { id: 2, category: 'Transportation', budgetAmount: 300, spentAmount: 180, icon: '🚗' },
    { id: 3, category: 'Entertainment', budgetAmount: 200, spentAmount: 195, icon: '🎬' },
    { id: 4, category: 'Utilities', budgetAmount: 400, spentAmount: 220, icon: '💡' },
    { id: 5, category: 'Shopping', budgetAmount: 250, spentAmount: 85, icon: '🛍️' },
    { id: 6, category: 'Healthcare', budgetAmount: 150, spentAmount: 0, icon: '🏥' }
  ];

  ngOnInit(): void {
    this.budgets = [...this.mockBudgets];
  }

  getProgressPercentage(budget: Budget): number {
    const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
    return Math.min(Math.round(percentage), 100);
  }

  getProgressClass(budget: Budget): string {
    const percentage = this.getProgressPercentage(budget);
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'safe';
  }

  getTotalBudget(): number {
    return this.budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  }

  getTotalSpent(): number {
    return this.budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  }

  getRemaining(): number {
    return this.getTotalBudget() - this.getTotalSpent();
  }

  addBudget(): void {
    if (!this.newBudget.category || this.newBudget.budgetAmount <= 0) {
      alert('Please fill in all fields correctly');
      return;
    }

    const budget: Budget = {
      id: Math.max(...this.budgets.map(b => b.id), 0) + 1,
      category: this.newBudget.category,
      budgetAmount: this.newBudget.budgetAmount,
      spentAmount: 0,
      icon: this.newBudget.icon || '💰'
    };

    this.budgets.push(budget);
    
    this.newBudget = {
      category: '',
      budgetAmount: 0,
      icon: '💰'
    };
    this.showAddForm = false;
  }

  deleteBudget(id: number): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgets = this.budgets.filter(b => b.id !== id);
    }
  }
}