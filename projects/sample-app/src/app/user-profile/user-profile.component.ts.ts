import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastService, ToastType } from 'angular-toast-notifications';
import { environment } from '../../environments/environment';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-profile">
      <h1>User Profile</h1>
      
      <form (ngSubmit)="saveProfile()">
        <div class="form-group">
          <label>Name:</label>
          <input type="text" [(ngModel)]="profile.name" name="name" />
        </div>
        
        <div class="form-group">
          <label>Email:</label>
          <input type="email" [(ngModel)]="profile.email" name="email" />
        </div>
        
        <button type="submit">Save Profile</button>
      </form>

      <div class="actions">
        <button (click)="showSuccessToast()">Show Success</button>
        <button (click)="showErrorToast()">Show Error</button>
        <button (click)="showWarningToast()">Show Warning</button>
        <button (click)="showInfoToast()">Show Info</button>
      </div>
    </div>
  `,
  styles: [`
    .user-profile {
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .actions {
      margin-top: 20px;
    }
    button {
      margin-right: 10px;
    }
  `]
})
export class UserProfileComponent {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  profile: UserProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  saveProfile() {
    this.http.put(`${environment.apiUrl}/api/users/profile`, this.profile)
      .subscribe({
        next: (response) => {
          this.toastService.show({
            title: 'Success',
            message: 'Profile updated successfully!',
            type: ToastType.Success
          });
        },
        error: (error) => {
          this.toastService.show({
            title: 'Error',
            message: 'Failed to update profile. Please try again.',
            type: ToastType.Error,
            duration: 5000 // Override default duration
          });
        }
      });
  }

  showSuccessToast() {
    this.toastService.success('Operation completed successfully!');
  }

  showErrorToast() {
    this.toastService.error('Something went wrong!');
  }

  showWarningToast() {
    this.toastService.warning('Please review your input.');
  }

  showInfoToast() {
    this.toastService.info('This is an informational message.');
  }
}