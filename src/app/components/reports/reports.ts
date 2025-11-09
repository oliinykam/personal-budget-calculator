import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Time Period</label>
          <select [(ngModel)]="selectedPeriod" (ngModelChange)="updateReports()">
            <option value="month">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Report Type</label>
          <select [(ngModel)]="reportType">
            <option value="all">All Reports</option>
            <option value="income">Income Analysis</option>
            <option value="expense">Expense Analysis</option>
            <option value="category">Category Breakdown</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Export</label>
          <button class="btn btn-primary" style="width: 100%;">📄 Export PDF</button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Average Monthly Income</h3>
          <div class="amount income-color">\${{ avgIncome.toFixed(2) }}</div>
          <div class="change">Based on selected period</div>
        </div>
        <div class="stat-card">
          <h3>Average Monthly Expenses</h3>
          <div class="amount expense-color">\${{ avgExpenses.toFixed(2) }}</div>
          <div class="change">Based on selected period</div>
        </div>
        <div class="stat-card">
          <h3>Savings Rate</h3>
          <div class="amount savings-color">{{ savingsRate }}%</div>
          <div class="change">{{ getSavingsMessage() }}</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Monthly Comparison Chart -->
        <div class="chart-card">
          <h2>📊 Monthly Comparison</h2>
          <div class="bar-chart">
            <div class="chart-bars">
              <div *ngFor="let month of monthlyData" class="bar-group">
                <div class="bar-container">
                  <div class="bar income-bar" [style.height.%]="(month.income / maxMonthlyValue) * 100">
                    <span class="bar-label" *ngIf="month.income > 0">\${{ month.income }}</span>
                  </div>
                  <div class="bar expense-bar" [style.height.%]="(month.expenses / maxMonthlyValue) * 100">
                    <span class="bar-label" *ngIf="month.expenses > 0">\${{ month.expenses }}</span>
                  </div>
                </div>
                <div class="bar-month">{{ month.month }}</div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color income-bg"></span>
                <span>Income</span>
              </div>
              <div class="legend-item">
                <span class="legend-color expense-bg"></span>
                <span>Expenses</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="chart-card">
          <h2>🎯 Expense Distribution</h2>
          <div class="pie-chart">
            <div *ngFor="let category of categoryData; let i = index" class="category-row">
              <div class="category-info">
                <span class="category-dot" [style.background-color]="getCategoryColor(i)"></span>
                <span class="category-name">{{ category.label }}</span>
              </div>
              <div class="category-bar-container">
                <div 
                  class="category-bar" 
                  [style.width.%]="(category.value / totalExpenses) * 100"
                  [style.background-color]="getCategoryColor(i)">
                </div>
              </div>
              <span class="category-value">\${{ category.value }} ({{ ((category.value / totalExpenses) * 100).toFixed(0) }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="chart-card full-width">
        <h2>📈 Balance Trend</h2>
        <div class="line-chart">
          <div class="chart-grid">
            <div *ngFor="let point of trendData; let i = index" class="trend-point">
              <div class="trend-line-container">
                <div 
                  class="trend-bar" 
                  [style.height.%]="(point.value / maxTrendValue) * 100"
                  [ngClass]="{'positive': point.value > 0, 'negative': point.value < 0}">
                </div>
              </div>
              <div class="trend-label">{{ point.label }}</div>
              <div class="trend-value">\${{ point.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights Section -->
      <div class="insights-section">
        <h2>💡 Financial Insights</h2>
        <div class="insights-grid">
          <div class="insight-card" [ngClass]="getInsightClass('spending')">
            <div class="insight-icon">{{ getInsightIcon('spending') }}</div>
            <div class="insight-content">
              <h3>Spending Trend</h3>
              <p>{{ getSpendingInsight() }}</p>
            </div>
          </div>
          <div class="insight-card" [ngClass]="getInsightClass('savings')">
            <div class="insight-icon">{{ getInsightIcon('savings') }}</div>
            <div class="insight-content">
              <h3>Savings Goal</h3>
              <p>{{ getSavingsInsight() }}</p>
            </div>
          </div>
          <div class="insight-card" [ngClass]="getInsightClass('budget')">
            <div class="insight-icon">{{ getInsightIcon('budget') }}</div>
            <div class="insight-content">
              <h3>Budget Status</h3>
              <p>{{ getBudgetInsight() }}</p>
            </div>
          </div>
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
    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
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
    .filter-group select {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .filter-group select:focus {
      outline: none;
      border-color: #3498db;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      font-size: 0.9rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      font-weight: 600;
    }
    .stat-card .amount {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .income-color { color: #27ae60; }
    .expense-color { color: #e74c3c; }
    .savings-color { color: #3498db; }
    .stat-card .change {
      font-size: 0.85rem;
      color: #7f8c8d;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .chart-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .chart-card.full-width {
      grid-column: 1 / -1;
    }
    .chart-card h2 {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }
    .bar-chart {
      padding: 1rem 0;
    }
    .chart-bars {
      display: flex;
      gap: 2rem;
      align-items: flex-end;
      height: 250px;
      padding: 0 1rem;
      justify-content: space-evenly;
    }
    .bar-group {
      flex: 1;
      max-width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bar-container {
      width: 100%;
      height: 100%;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      justify-content: center;
    }
    .bar {
      flex: 1;
      max-width: 35px;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: all 0.3s;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.5rem;
    }
    .bar:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }
    .income-bar {
      background: linear-gradient(180deg, #27ae60, #2ecc71);
    }
    .expense-bar {
      background: linear-gradient(180deg, #e74c3c, #c0392b);
    }
    .bar-label {
      font-size: 0.7rem;
      color: white;
      font-weight: 600;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      margin-bottom: 0.625rem;
    }
    .bar-month {
      margin-top: 0.75rem;
      font-size: 0.85rem;
      color: #2c3e50;
      font-weight: 600;
      text-align: center;
    } 
    .chart-legend {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }
    .income-bg {
      background: #27ae60;
    }
    .expense-bg {
      background: #e74c3c;
    }
    .pie-chart {
      padding: 1rem 0;
    }
    .category-row {
      display: grid;
      grid-template-columns: 150px 1fr 120px;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #ecf0f1;
    }
    .category-row:last-child {
      border-bottom: none;
    }
    .category-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .category-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .category-name {
      font-size: 0.9rem;
      color: #2c3e50;
      font-weight: 500;
    }
    .category-bar-container {
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
    }
    .category-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .category-value {
      font-size: 0.85rem;
      color: #7f8c8d;
      font-weight: 600;
      text-align: right;
    }
    .line-chart {
      padding: 1rem 0;
    }
    .chart-grid {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      height: 200px;
    }
    .trend-point {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .trend-line-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .trend-bar {
      width: 60%;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      transition: all 0.3s;
    }
    .trend-bar.positive {
      background: linear-gradient(180deg, #3498db, #5dade2);
    }
    .trend-bar.negative {
      background: linear-gradient(180deg, #e74c3c, #ec7063);
    }
    .trend-label {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #7f8c8d;
      font-weight: 500;
    }
    .trend-value {
      font-size: 0.8rem;
      color: #2c3e50;
      font-weight: 600;
    }
    .insights-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-top: 1.5rem;
    }
    .insights-section h2 {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .insight-card {
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      gap: 1rem;
      transition: transform 0.3s;
    }
    .insight-card:hover {
      transform: translateY(-3px);
    }
    .insight-card.good {
      background: #d4edda;
      border-left: 4px solid #27ae60;
    }
    .insight-card.warning {
      background: #fff3cd;
      border-left: 4px solid #f39c12;
    }
    .insight-card.alert {
      background: #f8d7da;
      border-left: 4px solid #e74c3c;
    }
    .insight-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    .insight-content h3 {
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    .insight-content p {
      margin: 0;
      color: #555;
      font-size: 0.9rem;
      line-height: 1.5;
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
    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
      .chart-bars {
        gap: 0.5rem;
      }
      .bar {
        width: 30px;
      }
      .category-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  selectedPeriod: string = '6months';
  reportType: string = 'all';
  
  avgIncome: number = 0;
  avgExpenses: number = 0;
  savingsRate: number = 0;
  totalExpenses: number = 0;
  maxMonthlyValue: number = 0;
  maxTrendValue: number = 0;

  monthlyData: any[] = [];
  categoryData: ChartData[] = [];
  trendData: any[] = [];

  // All available data for different periods
  private allMonthlyData = {
    'month': [
      { month: 'Oct', income: 5240, expenses: 3680 }
    ],
    'lastMonth': [
      { month: 'Sep', income: 4700, expenses: 3300 }
    ],
    '3months': [
      { month: 'Aug', income: 4900, expenses: 3500 },
      { month: 'Sep', income: 4700, expenses: 3300 },
      { month: 'Oct', income: 5240, expenses: 3680 }
    ],
    '6months': [
      { month: 'May', income: 4500, expenses: 3200 },
      { month: 'Jun', income: 4800, expenses: 3400 },
      { month: 'Jul', income: 5200, expenses: 3800 },
      { month: 'Aug', income: 4900, expenses: 3500 },
      { month: 'Sep', income: 4700, expenses: 3300 },
      { month: 'Oct', income: 5240, expenses: 3680 }
    ],
    'year': [
      { month: 'Jan', income: 4200, expenses: 3100 },
      { month: 'Feb', income: 4300, expenses: 3000 },
      { month: 'Mar', income: 4600, expenses: 3400 },
      { month: 'Apr', income: 4400, expenses: 3200 },
      { month: 'May', income: 4500, expenses: 3200 },
      { month: 'Jun', income: 4800, expenses: 3400 },
      { month: 'Jul', income: 5200, expenses: 3800 },
      { month: 'Aug', income: 4900, expenses: 3500 },
      { month: 'Sep', income: 4700, expenses: 3300 },
      { month: 'Oct', income: 5240, expenses: 3680 },
      { month: 'Nov', income: 4800, expenses: 3500 },
      { month: 'Dec', income: 5000, expenses: 3600 }
    ]
  };

  private allTrendData = {
    'month': [
      { label: 'Week 1', value: 1200 },
      { label: 'Week 2', value: 1350 },
      { label: 'Week 3', value: 1500 },
      { label: 'Week 4', value: 1560 }
    ],
    'lastMonth': [
      { label: 'Week 1', value: 1100 },
      { label: 'Week 2', value: 1250 },
      { label: 'Week 3', value: 1350 },
      { label: 'Week 4', value: 1400 }
    ],
    '3months': [
      { label: 'Aug', value: 1400 },
      { label: 'Sep', value: 1400 },
      { label: 'Oct', value: 1560 }
    ],
    '6months': [
      { label: 'May', value: 1300 },
      { label: 'Jun', value: 1400 },
      { label: 'Jul', value: 1400 },
      { label: 'Aug', value: 1400 },
      { label: 'Sep', value: 1400 },
      { label: 'Oct', value: 1560 }
    ],
    'year': [
      { label: 'Jan', value: 1100 },
      { label: 'Feb', value: 1300 },
      { label: 'Mar', value: 1200 },
      { label: 'Apr', value: 1200 },
      { label: 'May', value: 1300 },
      { label: 'Jun', value: 1400 },
      { label: 'Jul', value: 1400 },
      { label: 'Aug', value: 1400 },
      { label: 'Sep', value: 1400 },
      { label: 'Oct', value: 1560 },
      { label: 'Nov', value: 1300 },
      { label: 'Dec', value: 1400 }
    ]
  };

  private allCategoryData: { [key: string]: ChartData[] } = {
    'month': [
      { label: 'Food', value: 520 },
      { label: 'Transport', value: 180 },
      { label: 'Entertainment', value: 195 },
      { label: 'Utilities', value: 220 },
      { label: 'Shopping', value: 85 },
      { label: 'Other', value: 150 }
    ],
    'lastMonth': [
      { label: 'Food', value: 480 },
      { label: 'Transport', value: 160 },
      { label: 'Entertainment', value: 180 },
      { label: 'Utilities', value: 210 },
      { label: 'Shopping', value: 70 },
      { label: 'Other', value: 140 }
    ],
    '3months': [
      { label: 'Food', value: 1500 },
      { label: 'Transport', value: 520 },
      { label: 'Entertainment', value: 565 },
      { label: 'Utilities', value: 650 },
      { label: 'Shopping', value: 240 },
      { label: 'Other', value: 430 }
    ],
    '6months': [
      { label: 'Food', value: 3000 },
      { label: 'Transport', value: 1050 },
      { label: 'Entertainment', value: 1150 },
      { label: 'Utilities', value: 1300 },
      { label: 'Shopping', value: 480 },
      { label: 'Other', value: 900 }
    ],
    'year': [
      { label: 'Food', value: 6000 },
      { label: 'Transport', value: 2100 },
      { label: 'Entertainment', value: 2300 },
      { label: 'Utilities', value: 2600 },
      { label: 'Shopping', value: 960 },
      { label: 'Other', value: 1800 }
    ]
  };

  categoryColors = ['#e74c3c', '#2196f3', '#9c27b0', '#ff9800', '#4caf50', '#95a5a6'];

  ngOnInit(): void {
    this.updateReports();
  }

  updateReports(): void {
    // Update monthly data based on selected period
    this.monthlyData = this.allMonthlyData[this.selectedPeriod as keyof typeof this.allMonthlyData] || this.allMonthlyData['6months'];
    
    // Update trend data
    this.trendData = this.allTrendData[this.selectedPeriod as keyof typeof this.allTrendData] || this.allTrendData['6months'];
    
    // Update category data
    this.categoryData = this.allCategoryData[this.selectedPeriod] || this.allCategoryData['6months'];

    // Calculate statistics
    const totalIncome = this.monthlyData.reduce((sum, m) => sum + m.income, 0);
    const totalExpensesSum = this.monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const monthCount = this.monthlyData.length;

    this.avgIncome = totalIncome / monthCount;
    this.avgExpenses = totalExpensesSum / monthCount;
    this.savingsRate = Math.round(((totalIncome - totalExpensesSum) / totalIncome) * 100);
    
    // Update chart values
    this.totalExpenses = this.categoryData.reduce((sum, c) => sum + c.value, 0);
    this.maxMonthlyValue = Math.max(
      ...this.monthlyData.map(m => Math.max(m.income, m.expenses))
    );
    this.maxTrendValue = Math.max(...this.trendData.map(t => Math.abs(t.value)));
  }

  getCategoryColor(index: number): string {
    return this.categoryColors[index % this.categoryColors.length];
  }

  getSavingsMessage(): string {
    if (this.savingsRate >= 30) return "Excellent! Keep it up! 🎉";
    if (this.savingsRate >= 20) return "Good work! 👍";
    if (this.savingsRate >= 10) return "You can do better! 💪";
    return "Need improvement 📊";
  }

  getSpendingInsight(): string {
    return "Your spending decreased by 5% compared to last month. Great job maintaining control!";
  }

  getSavingsInsight(): string {
    if (this.savingsRate >= 30) {
      return "You're exceeding the recommended 20% savings rate. Excellent financial discipline!";
    } else if (this.savingsRate >= 20) {
      return "You're meeting the 20% savings goal. Keep maintaining this healthy habit!";
    } else {
      return "Try to increase your savings rate to at least 20% of your income for better financial health.";
    }
  }

  getBudgetInsight(): string {
    return "You're staying within budget for most categories. Watch your entertainment expenses - they're at 97%!";
  }

  getInsightClass(type: string): string {
    if (type === 'spending') return 'good';
    if (type === 'savings') {
      return this.savingsRate >= 20 ? 'good' : 'warning';
    }
    if (type === 'budget') return 'warning';
    return 'good';
  }

  getInsightIcon(type: string): string {
    if (type === 'spending') return '📉';
    if (type === 'savings') return '💰';
    if (type === 'budget') return '⚠️';
    return '💡';
  }
}