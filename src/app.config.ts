import { provideHttpClient, withFetch, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AuthService } from './app/services/auth.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, 
            withInMemoryScrolling({ 
                anchorScrolling: 'enabled', 
                scrollPositionRestoration: 'enabled' 
            }), 
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideAnimationsAsync(),
        providePrimeNG({ 
            theme: { 
                preset: Aura, 
                options: { darkModeSelector: '.app-dark' } 
            } 
        })
    ]
};