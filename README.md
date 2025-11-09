# **Project Name:** | 💰PersonalBudgetCalculator
**👥Authors:** [Oliinyk Andrii](https://github.com/oliinykam) • [Nadiia Stelmakh](https://github.com/StelmakhNadiia) 

## ✨Features
💸 Financial Management

📊 Transaction Tracking - Add, edit, and delete income and expense transactions with ease
🏷 Smart Categorization - Organize transactions by categories (Food, Transport, Entertainment, etc.)
🔍 Advanced Filtering - Filter transactions by date, category, and type

📈 Budget & Analytics

💰 Budget Planning - Set monthly budgets for different spending categories
📊 Visual Reports - Beautiful charts and graphs showing your financial trends
🎯 Financial Goals - Set savings goals and track your progress
💡 Smart Insights - Get personalized financial insights and recommendations

🎨 User Experience

📱 Responsive Design - Works perfectly on desktop, tablet, and mobile devices
🌓 Modern UI - Clean and intuitive interface with smooth animations
⚡️ Fast Performance - Optimized for speed and efficiency
🔒 Secure - Your financial data stays safe and private


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.



## 🏗️ Project Structure
```text
personal-budget-calculator/
├── 📁 .angular/                 # Angular cache
├── 📁 .vscode/                  # VS Code settings
├── 📁 node_modules/             # Dependencies
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 components/       # Application components
│   │   │   ├── 📂 budgets/      # Budget management
│   │   │   │   ├── budgets.component.ts
│   │   │   │   ├── budgets.component.html
│   │   │   │   └── budgets.component.css
│   │   │   ├── 📂 dashboard/    # Main dashboard
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.css
│   │   │   ├── 📂 navbar/       # Navigation bar
│   │   │   │   ├── navbar.component.ts
│   │   │   │   ├── navbar.component.html
│   │   │   │   └── navbar.component.css
│   │   │   ├── 📂 reports/      # Financial reports & analytics
│   │   │   │   ├── reports.component.ts
│   │   │   │   ├── reports.component.html
│   │   │   │   └── reports.component.css
│   │   │   └── 📂 transactions/ # Transaction management
│   │   │       ├── transactions.component.ts
│   │   │       ├── transactions.component.html
│   │   │       └── transactions.component.css
│   │   ├── 📄 app.config.ts     # Application configuration
│   │   ├── 📄 app.css           # Global component styles
│   │   ├── 📄 app.html          # Root template
│   │   ├── 📄 app.routes.ts     # Application routing
│   │   ├── 📄 app.spec.ts       # Unit tests
│   │   └── 📄 app.ts            # Root component
│   ├── 📄 index.html            # Main HTML file
│   ├── 📄 main.ts               # Application entry point
│   └── 📄 styles.css            # Global styles
├── 📄 .editorconfig             # Editor configuration
├── 📄 .gitignore                # Git ignore rules
├── 📄 angular.json              # Angular workspace configuration
├── 📄 package-lock.json         # Locked dependencies
├── 📄 package.json              # Project dependencies & scripts
├── 📄 README.md                 # Project documentation
├── 📄 tsconfig.app.json         # TypeScript config for app
├── 📄 tsconfig.json             # Base TypeScript configuration
└── 📄 tsconfig.spec.json        # TypeScript config for tests
```
## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

