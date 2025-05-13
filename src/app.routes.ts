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
import { DashboardComponent } from './app/pages/dashboard/dashboard';
import { ReservationListComponent } from './app/pages/reservations/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './app/pages/reservations/reservation-form/reservation-form.component';

export const appRoutes: Routes = [
    // Auth routes
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: 'landing', component: Landing },
    // {
    //     path: 'admin',
    //     loadChildren: () => import('./app/pages/admin/admin.routes'),
    //     canActivate: [AdminGuard],
    //     data: { roles: ['ROLE_ADMIN'] }
    //   },

    // // App layout (with header/sidebar)
    // {
    //     path: '',
    //     component: AppLayout,
    //     // canActivate: [AuthGuard],
    //     children: [
    //         { path: '', redirectTo: 'rooms', pathMatch: 'full' },
    //         { path: 'rooms', children: ROOM_ROUTES }, // ✅ rooms inside layout
    //         { path: 'calendar', component: CalendarComponent, data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
    //         { path: 'documentation', component: Documentation },
           
    //     ]
    // },

    // // Admin zone
    // {
    //     // canActivate: [AuthGuard], // à commenter si tu veux tester sans login
    //     children: [
    //         { path: '', redirectTo: 'reservations', pathMatch: 'full' },
    //         { path: 'reservations', component: ReservationListComponent },
    //         { path: 'reservations/create', component: ReservationFormComponent },
    //         { path: 'reservations/edit/:id', component: ReservationFormComponent },
           
    //         {
    //             path: 'calendar',
    //             component: CalendarComponent,
    //             data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }
    //         }
    //     ]
    // },

    // {
    //     path: 'calendar',
    //     component: CalendarComponent,
    //     canActivate: [AuthGuard],
    //     data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] ,

    //     }
    // },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // // Admin routes with role-based guard
    // {
    //     path: 'admin',
    //     component: AppLayout,
    //     canActivate: [AuthGuard],
    //     data: { roles: ['ROLE_ADMIN'] },
    //     children: [
    //         { path: 'users', loadChildren: () => import('./app/pages/admin/admin.routes') },
    //         { path: '', redirectTo: 'users', pathMatch: 'full' }
    //     ]
    // },
    // { path: '**', redirectTo: '/notfound' }

    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent , data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { 
                path: 'calendar', 
                component: CalendarComponent,
                data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }
            },
            { path: 'rooms', children: ROOM_ROUTES },
            { path: 'reservations', component: ReservationListComponent },
            { path: 'reservations/create', component: ReservationFormComponent , data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] }},
            { path: 'reservations/edit/:id', component: ReservationFormComponent },
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
