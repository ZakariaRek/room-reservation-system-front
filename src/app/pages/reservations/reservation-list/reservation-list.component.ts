import { Component, OnInit } from '@angular/core';
import { ReservationService, Reservation } from '../../../services/reservation1.service';

import { DatePipe, NgForOf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Panel } from 'primeng/panel';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';



@Component({
    selector: 'app-reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['./reservation-list.component.scss'],
    imports: [DatePipe, TableModule, Panel, RouterLink, ButtonDirective]
})
export class ReservationListComponent implements OnInit {
    reservations: Reservation[] = []; // Variable pour stocker les réservations récupérées depuis l'API

    constructor(private reservationService: ReservationService) {}

    ngOnInit(): void {
        this.loadReservations(); // Charge les réservations au moment où le composant est initialisé
    }

    // Méthode pour charger les réservations depuis le backend
    loadReservations(): void {
        this.reservationService.getReservations().subscribe(
            (reservations) => {
                this.reservations = reservations; // Assigne les réservations récupérées à la variable
            },
            (error) => {
                console.error('Erreur lors de la récupération des réservations', error); // Gère les erreurs de la requête
            }
        );
    }

    // Méthode pour supprimer une réservation
    deleteReservation(id: number): void {
        this.reservationService.deleteReservation(id).subscribe(() => {
            this.loadReservations(); // Recharge la liste des réservations après suppression
        });
    }
}
