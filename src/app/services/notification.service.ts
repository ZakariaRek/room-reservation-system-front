import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Notification {
  id: number;
  message: string;
  date: string;
  status: string;
  senderId: number;
  receiverId: number;
  reservationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8083/api/notifications';
  
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

  getNotificationsByReceiverId(receiverId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/receiver/${receiverId}`, this.getAuthHeaders());
  }

  getUnreadNotifications(receiverId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/receiver/${receiverId}/status/PENDING`, this.getAuthHeaders());
  }

  updateNotificationStatus(id: number, status: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/status?status=${status}`, {}, this.getAuthHeaders());
  }
}