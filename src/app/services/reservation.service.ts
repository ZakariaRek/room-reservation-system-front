import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class ReservationService1 {
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
import { AuthService } from './auth.service';

export interface Reservation {
  id: number;
  date: string;
  fromtime: string;
  totime: string;
  status: string;
  roomId: number;
  userId: number;
}

export interface TimeSlot {
  fromTime: string;
  toTime: string;
  available: boolean;
}

export interface ReservationRequest {
  date: string;
  fromtime: string | null;
  totime: string | null;
  allDay: boolean;
  roomId: number;
  userId: number | null;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8083/api/reservations';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, this.getAuthHeaders());
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`, this.getAuthHeaders());
  }

  getReservationsByDateRange(startDate: string, endDate: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`, 
      this.getAuthHeaders()
    );
  }

  getConfirmedReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/confirmed`, this.getAuthHeaders());
  }

  updateReservationStatus(id: number, status: string): Observable<Reservation> {
    return this.http.patch<Reservation>(
      `${this.apiUrl}/${id}/status?status=${status}`, 
      {}, 
      this.getAuthHeaders()
    );
  }

  createReservation(reservation: ReservationRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservation, this.getAuthHeaders());
  }

  updateReservation(id: number, reservation: any): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation, this.getAuthHeaders());
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  getReservationsByRoomId(roomId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/room/${roomId}`, this.getAuthHeaders());
  }

  getReservationsByDateAndRoomId(date: string, roomId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/date/${date}/room/${roomId}`, 
      this.getAuthHeaders()
    );
  }

  getAvailableTimeSlots(date: string, roomId: number): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(
      `${this.apiUrl}/available-slots?date=${date}&roomId=${roomId}`, 
      this.getAuthHeaders()
    );
  }
}
