import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
// import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';

export const appRoutes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./app/pages/admin/admin.routes'),
        canActivate: [AdminGuard],
        data: { roles: ['ROLE_ADMIN'] }
      },
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            // { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // Admin routes with role-based guard
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
    { path: '**', redirectTo: '/notfound' }
];