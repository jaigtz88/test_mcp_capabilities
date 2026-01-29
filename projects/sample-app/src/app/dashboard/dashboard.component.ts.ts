import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService, ToastType, ToastPosition } from 'angular-toast-notifications';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      
      <div class="stats" *ngIf="stats">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>{{ stats.totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Active Sessions</h3>
          <p>{{ stats.activeSessions }}</p>
        </div>
      </div>

      <button (click)="refreshData()">Refresh Data</button>
      <button (click)="showCustomToast()">Show Custom Toast</button>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  stats: any;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.http.get(`${environment.apiUrl}/api/dashboard/stats`)
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.toastService.show({
            title: 'Data Loaded',
            message: 'Dashboard data refreshed successfully',
            type: ToastType.Info,
            duration: 2000
          });
        },
        error: (error) => {
          this.toastService.show({
            title: 'Connection Error',
            message: 'Unable to load dashboard data. Retrying...',
            type: ToastType.Error,
            duration: 5000,
            pauseOnHover: true
          });
        }
      });
  }

  refreshData() {
    this.toastService.show({
      title: 'Refreshing...',
      message: 'Fetching latest data from server',
      type: ToastType.Info,
      showProgressBar: true
    });
    
    this.loadDashboardData();
  }

  showCustomToast() {
    // Show toast with custom configuration
    this.toastService.show({
      title: 'Custom Notification',
      message: 'This toast has custom settings!',
      type: ToastType.Success,
      duration: 10000,
      position: ToastPosition.BottomRight,
      showProgressBar: true,
      pauseOnHover: true,
      enableSound: true,
      onClick: () => {
        console.log('Toast clicked!');
      },
      onClose: () => {
        console.log('Toast closed!');
      }
    });
  }
}