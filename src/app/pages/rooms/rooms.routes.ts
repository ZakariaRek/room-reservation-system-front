import { Routes } from '@angular/router';

export const ROOM_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./room-list/room-list.component').then(m => m.RoomListComponent)
    },
    {
        path: 'create',
        loadComponent: () => import('./room-form/room-form.component').then(m => m.RoomFormComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./room-form/room-form.component').then(m => m.RoomFormComponent)
    }
];
