import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
// import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';
import { CalendarComponent } from './app/pages/calendar/calendar.component';
import { ROOM_ROUTES } from './app/pages/rooms/rooms.routes';
export const appRoutes: Routes = [
    // Auth routes
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'landing', component: Landing },

    // App layout (with header/sidebar)
    {
        path: '',
        component: AppLayout,
        // canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'rooms', pathMatch: 'full' },
            { path: 'rooms', children: ROOM_ROUTES }, // ✅ rooms inside layout
            { path: 'calendar', component: CalendarComponent, data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
            { path: 'documentation', component: Documentation },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },

    // Admin zone
    {
        path: 'admin',
        component: AppLayout,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
        children: [
            { path: 'users', loadChildren: () => import('./app/pages/admin/admin.routes') },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },

    // Not found
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: 'notfound' } // ✅ keep only this wildcard
];

