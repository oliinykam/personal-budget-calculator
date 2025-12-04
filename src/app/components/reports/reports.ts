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
  templateUrl: 'reports.html',
  styleUrls: ['reports.css']
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