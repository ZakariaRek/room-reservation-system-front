import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
// import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';
import { CalendarComponent } from './app/pages/calendar/calendar.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard';
import { ReservationListComponent } from './app/pages/reservations/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './app/pages/reservations/reservation-form/reservation-form.component';

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
        // canActivate: [AuthGuard], // à commenter si tu veux tester sans login
        children: [
            { path: '', redirectTo: 'reservations', pathMatch: 'full' },
            { path: 'reservations', component: ReservationListComponent },
            { path: 'reservations/create', component: ReservationFormComponent },
            { path: 'reservations/edit/:id', component: ReservationFormComponent },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            {
                path: 'calendar',
                component: CalendarComponent,
                data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }
            }
        ]
    },

    {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] ,

        }
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
