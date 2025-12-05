import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <h1>💰 Budget Manager</h1>
      <ul class="nav-links">
        <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li><a routerLink="/transactions" routerLinkActive="active">Transactions</a></li>
        <li><a routerLink="/budgets" routerLinkActive="active">Budgets</a></li>
        <li><a routerLink="/reports" routerLinkActive="active">Reports</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .navbar h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
      font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active {
      background: #34495e;
    }
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }
      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class NavbarComponent {}