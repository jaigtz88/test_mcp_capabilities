[GoTo Readme](../README.md)

# Toast Notification Configuration

This guide shows how to configure the `angular-toast-notifications` library in your Angular application using JSON-based configuration with environment-specific overrides.

## Configuration Properties

The `ToastConfig` interface defines all available configuration options:

```typescript
export interface ToastConfig {
  position: ToastPosition;           // Toast position on screen
  duration: number;                  // Default duration in milliseconds
  maxToasts: number;                 // Maximum toasts to show at once
  animationDuration: number;         // Animation duration in milliseconds
  showProgressBar: boolean;          // Show progress bar
  pauseOnHover: boolean;            // Pause timer on hover
  enableSound: boolean;              // Enable notification sound
  defaultType: ToastType;           // Default toast type
  allowedOrigins: string[];         // Allowed origins for notifications
}
```

### Configuration Options

- **`position`**: Where toasts appear on screen
  - Options: `top-right`, `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`
  - Default: `top-right`

- **`duration`**: How long toasts stay visible (milliseconds)
  - Default: `3000`
  - Set to `0` for persistent toasts

- **`maxToasts`**: Maximum number of toasts displayed simultaneously
  - Default: `5`

- **`animationDuration`**: Duration of show/hide animations (milliseconds)
  - Default: `300`

- **`showProgressBar`**: Display a progress bar showing remaining time
  - Default: `true`

- **`pauseOnHover`**: Pause the timer when mouse hovers over toast
  - Default: `true`

- **`enableSound`**: Play a sound when toast appears
  - Default: `false`

- **`defaultType`**: Default toast type if not specified
  - Options: `success`, `error`, `warning`, `info`
  - Default: `info`

- **`allowedOrigins`**: Array of allowed API origins for cross-origin notifications

## Setup with JSON Configuration File

### Step 1: Create JSON Configuration File

Create a configuration file at `src/assets/config/toast-config.json`:

```json
{
  "position": "top-right",
  "duration": 3000,
  "maxToasts": 5,
  "animationDuration": 300,
  "showProgressBar": true,
  "pauseOnHover": true,
  "enableSound": false,
  "defaultType": "info",
  "allowedOrigins": [
    "https://api.myapp.com",
    "https://admin.myapp.com",
    "https://notifications.myapp.com"
  ]
}
```

### Step 2: Create HTTP Loader Factory

In your `app.config.ts`, create a factory function to load and process the configuration:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ToastConfig, ToastNotificationModule } from 'angular-toast-notifications';
import { environment } from '../environments/environment';

/**
 * Factory function to load Toast configuration from JSON
 * This demonstrates loading from JSON file with environment-specific overrides
 */
export const httpLoaderFactoryToast = (httpClient: HttpClient): Observable<ToastConfig> => {
  return httpClient
    .get<ToastConfig>(`${window.location.origin}/assets/config/toast-config.json`)
    .pipe(
      map((config: ToastConfig) => {
        // Override settings based on environment
        if (environment.production) {
          config.enableSound = false; // Disable sound in production
          config.duration = 5000; // Longer duration in production
        } else {
          config.enableSound = true; // Enable sound in development
          config.duration = 3000; // Shorter duration for testing
        }
        
        // Log configuration in development
        if (!environment.production) {
          console.log('Toast Notification Config loaded:', config);
        }
        
        return config;
      })
    );
};
```

### Step 3: Configure Application

Register the Toast module in your application configuration:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    
    // Configure Toast Notification Module with HTTP loader
    importProvidersFrom(
      ToastNotificationModule.forRootWithProvider(httpLoaderFactoryToast)
    ),
    
    provideRouter(routes),
  ],
};
```

## Static Configuration (Without JSON)

If you prefer to configure toasts directly in code without loading from JSON:

```typescript
import { ToastNotificationModule, ToastPosition, ToastType } from 'angular-toast-notifications';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    
    importProvidersFrom(
      ToastNotificationModule.forRoot({
        position: ToastPosition.TopRight,
        duration: 3000,
        maxToasts: 5,
        animationDuration: 300,
        showProgressBar: true,
        pauseOnHover: true,
        enableSound: false,
        defaultType: ToastType.Info,
        allowedOrigins: ['https://api.myapp.com']
      })
    ),
    
    provideRouter(routes),
  ],
};
```
```
