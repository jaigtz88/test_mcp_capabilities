[GoTo Readme](../README.md)

# Toast Notification Usage Examples

This guide demonstrates how to use the `angular-toast-notifications` library in your Angular components.

## Basic Setup

First, inject the `ToastService` into your component:

```typescript
import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from 'angular-toast-notifications';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `
    <button (click)="showToast()">Show Toast</button>
  `
})
export class MyComponent {
  private toastService = inject(ToastService);

  showToast() {
    this.toastService.show({
      title: 'Hello',
      message: 'This is a toast notification!',
      type: ToastType.Info
    });
  }
}
```

## Toast Types

The library supports four toast types:

### Success Toast

```typescript
// Using shorthand method
this.toastService.success('Operation completed successfully!');

// Using full configuration
this.toastService.show({
  title: 'Success',
  message: 'Profile updated successfully!',
  type: ToastType.Success
});
```

### Error Toast

```typescript
// Using shorthand method
this.toastService.error('Something went wrong!');

// Using full configuration
this.toastService.show({
  title: 'Error',
  message: 'Failed to update profile. Please try again.',
  type: ToastType.Error,
  duration: 5000 // Override default duration
});
```

### Warning Toast

```typescript
// Using shorthand method
this.toastService.warning('Please review your input.');

// Using full configuration
this.toastService.show({
  title: 'Warning',
  message: 'Some fields need attention',
  type: ToastType.Warning
});
```

### Info Toast

```typescript
// Using shorthand method
this.toastService.info('This is an informational message.');

// Using full configuration
this.toastService.show({
  title: 'Data Loaded',
  message: 'Dashboard data refreshed successfully',
  type: ToastType.Info,
  duration: 2000
});
```

## Custom Configuration

You can override the global configuration for individual toasts:

```typescript
this.toastService.show({
  title: 'Custom Notification',
  message: 'This toast has custom settings!',
  type: ToastType.Success,
  duration: 10000,                      // 10 seconds
  position: ToastPosition.BottomRight,  // Different position
  showProgressBar: true,
  pauseOnHover: true,
  enableSound: true
});
```

## Toast Positions

Available positions:

```typescript
import { ToastPosition } from 'angular-toast-notifications';

ToastPosition.TopRight      // Top right corner
ToastPosition.TopLeft       // Top left corner
ToastPosition.TopCenter     // Top center
ToastPosition.BottomRight   // Bottom right corner
ToastPosition.BottomLeft    // Bottom left corner
ToastPosition.BottomCenter  // Bottom center
```

## Callbacks

Add callbacks to handle toast interactions:

```typescript
this.toastService.show({
  title: 'Interactive Toast',
  message: 'Click me or wait...',
  type: ToastType.Info,
  onClick: () => {
    console.log('Toast clicked!');
    // Handle click action
  },
  onClose: () => {
    console.log('Toast closed!');
    // Handle close action
  }
});
```

## Real-World Examples

### HTTP Request with Toast Feedback

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService, ToastType } from 'angular-toast-notifications';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <form (ngSubmit)="saveProfile()">
      <!-- form fields -->
      <button type="submit">Save Profile</button>
    </form>
  `
})
export class UserProfileComponent {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  saveProfile() {
    this.http.put('/api/users/profile', this.profile)
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
            duration: 5000
          });
        }
      });
  }
}
```

### Loading Data with Toast Notification

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService, ToastType } from 'angular-toast-notifications';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <button (click)="refreshData()">Refresh Data</button>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.http.get('/api/dashboard/stats')
      .subscribe({
        next: (data) => {
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
}
```

### Multiple Toast Demo Buttons

```typescript
import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from 'angular-toast-notifications';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  template: `
    <div class="demo-buttons">
      <button (click)="showSuccessToast()">Success</button>
      <button (click)="showErrorToast()">Error</button>
      <button (click)="showWarningToast()">Warning</button>
      <button (click)="showInfoToast()">Info</button>
    </div>
  `
})
export class ToastDemoComponent {
  private toastService = inject(ToastService);
  
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
```

## Best Practices

1. **Use Appropriate Types**: Choose the correct toast type for the message context
   - Success: Completed actions
   - Error: Failed operations
   - Warning: Potential issues or cautions
   - Info: General information

2. **Adjust Duration**: 
   - Short messages: 2-3 seconds
   - Error messages: 4-5 seconds (users need time to read)
   - Critical errors: Consider longer durations with `pauseOnHover: true`

3. **Avoid Toast Spam**: Don't show too many toasts at once. The `maxToasts` configuration helps control this.

4. **Progress Bars**: Use progress bars for toasts with longer durations so users know when they'll disappear.

5. **Position**: Consider your app's layout when choosing toast position. Avoid covering important UI elements.

6. **Callbacks**: Use `onClick` and `onClose` callbacks for interactive toasts or tracking analytics.
