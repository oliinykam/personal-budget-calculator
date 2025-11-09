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
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Monthly Budgets</h1>
        <button class="btn btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? '✕ Cancel' : '+ Create Budget' }}
        </button>
      </div>

      <!-- Add Budget Form -->
      <div class="add-form" *ngIf="showAddForm">
        <h3>Create New Budget</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" [(ngModel)]="newBudget.category" placeholder="e.g., Food & Groceries">
          </div>
          <div class="form-group">
            <label>Budget Amount</label>
            <input type="number" [(ngModel)]="newBudget.budgetAmount" placeholder="0.00" step="0.01">
          </div>
          <div class="form-group">
            <label>Icon (Emoji)</label>
            <input type="text" [(ngModel)]="newBudget.icon" placeholder="🍔" maxlength="2">
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-success" (click)="addBudget()">Create Budget</button>
          <button class="btn btn-secondary" (click)="showAddForm = false">Cancel</button>
        </div>
      </div>

      <!-- Budget Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon total">💰</div>
          <div class="summary-content">
            <h3>Total Budget</h3>
            <div class="summary-amount">\${{ getTotalBudget().toFixed(2) }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon spent">💸</div>
          <div class="summary-content">
            <h3>Total Spent</h3>
            <div class="summary-amount">\${{ getTotalSpent().toFixed(2) }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon remaining">💵</div>
          <div class="summary-content">
            <h3>Remaining</h3>
            <div class="summary-amount">\${{ getRemaining().toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- Budget List -->
      <div class="budget-list">
        <div class="budget-item" *ngFor="let budget of budgets">
          <div class="budget-header">
            <h3>{{ budget.icon }} {{ budget.category }}</h3>
            <div class="budget-amount">
              \${{ budget.spentAmount.toFixed(2) }} / \${{ budget.budgetAmount.toFixed(2) }}
            </div>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [ngClass]="getProgressClass(budget)"
              [style.width.%]="getProgressPercentage(budget)">
            </div>
          </div>
          <div class="budget-footer">
            <div class="progress-text">
              {{ getProgressPercentage(budget) }}% used - 
              \${{ (budget.budgetAmount - budget.spentAmount).toFixed(2) }} remaining
            </div>
            <button class="btn btn-delete btn-small" (click)="deleteBudget(budget.id)">
              Delete
            </button>
          </div>
        </div>
        
        <div *ngIf="budgets.length === 0" class="empty-state">
          <p>No budgets created yet. Click "Create Budget" to get started!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 2rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .page-header h1 {
      font-size: 1.5rem;
      margin: 0;
      color: #2c3e50;
    }
    .add-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .add-form h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
      font-size: 1.1rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    .form-group input {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .form-group input:focus {
      outline: none;
      border-color: #3498db;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .summary-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      flex-shrink: 0;
    }
    .summary-icon.total {
      background: #e3f2fd;
    }
    .summary-icon.spent {
      background: #fce4ec;
    }
    .summary-icon.remaining {
      background: #e8f5e9;
    }
    .summary-content h3 {
      font-size: 0.9rem;
      color: #7f8c8d;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      font-weight: 600;
    }
    .summary-amount {
      font-size: 1.8rem;
      font-weight: bold;
      color: #2c3e50;
    }
    .budget-list {
      display: grid;
      gap: 1.5rem;
    }
    .budget-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .budget-item:hover {
      transform: translateY(-3px);
    }
    .budget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .budget-header h3 {
      font-size: 1.1rem;
      margin: 0;
      color: #2c3e50;
    }
    .budget-amount {
      font-size: 0.9rem;
      color: #7f8c8d;
      font-weight: 600;
    }
    .progress-bar {
      height: 12px;
      background: #ecf0f1;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }
    .progress-fill {
      height: 100%;
      transition: width 0.5s ease;
      border-radius: 6px;
    }
    .progress-fill.safe {
      background: linear-gradient(90deg, #27ae60, #2ecc71);
    }
    .progress-fill.warning {
      background: linear-gradient(90deg, #f39c12, #f1c40f);
    }
    .progress-fill.danger {
      background: linear-gradient(90deg, #e74c3c, #c0392b);
    }
    .budget-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .progress-text {
      font-size: 0.85rem;
      color: #7f8c8d;
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
    .btn-delete {
      background: #e74c3c;
      color: white;
    }
    .btn-delete:hover {
      background: #c0392b;
    }
    .empty-state {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .empty-state p {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin: 0;
    }
  `]
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