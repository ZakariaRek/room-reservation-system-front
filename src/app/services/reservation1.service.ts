import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AuthService } from './auth.service';

export interface Reservation {
    id: number;
    date: string;
    time: string;
    roomId : number;
    userId : number;
    statut: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    // URL de l'API Spring Boot pour récupérer les réservations
    private apiUrl = 'http://localhost:8081/api/reservations';

    constructor(private http: HttpClient) {}

    // Méthode pour récupérer toutes les réservations
    getReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.apiUrl); // Envoie une requête GET pour récupérer toutes les réservations
    }

    // Méthode pour récupérer une réservation par ID
    getReservation(id: number): Observable<Reservation> {
        return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
    }

    // Méthode pour créer une nouvelle réservation
    createReservation(reservation: any): Observable<any> {
        console.log('Appel API POST :', reservation);
        return this.http.post(`${this.apiUrl}/reservations`, reservation);
    }



    // Méthode pour mettre à jour une réservation
    updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
        return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
    }

    // Méthode pour supprimer une réservation
    deleteReservation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Optionnel : Méthode pour récupérer la liste des statuts disponibles (si vous en avez besoin)
    getStatusList(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/status-list`);
    }
}