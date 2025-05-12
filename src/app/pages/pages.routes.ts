import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Empty } from './empty/empty';
import { ReservationListComponent } from './reservations/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './reservations/reservation-form/reservation-form.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'empty', component: Empty },

    // Routes réservations
    { path: 'reservations', component: ReservationListComponent },
    { path: 'reservations/create', component: ReservationListComponent },
    { path: 'reservations/edit/:id', component: ReservationListComponent },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
