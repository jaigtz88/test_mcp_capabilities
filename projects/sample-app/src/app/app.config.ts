import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Import Toast modules
import { 
  ToastConfig, 
  ToastNotificationModule, 
  ToastPosition,
  ToastType 
} from 'angular-toast-notifications';

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

/**
 * Main application configuration
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Provide HTTP client
    provideHttpClient(withInterceptorsFromDi()),
    
    // Configure Toast Notification Module with HTTP loader
    importProvidersFrom(
      ToastNotificationModule.forRootWithProvider(httpLoaderFactoryToast)
    ),
    
    // Configure router
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
  ],
};