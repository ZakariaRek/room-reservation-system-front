import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8083/api/dashboard';
  
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

  // Get overall dashboard statistics
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, this.getAuthHeaders());
  }

  // Get reservations by status
  getReservationsByStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations-by-status`, this.getAuthHeaders());
  }

  // Get room utilization
  getRoomUtilization(startDate?: string, endDate?: string): Observable<any[]> {
    let url = `${this.apiUrl}/room-utilization`;
    
    // Add date range parameters if provided
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    
    return this.http.get<any[]>(url, this.getAuthHeaders());
  }

  // Get reservations by day of week
  getReservationsByDay(startDate?: string, endDate?: string): Observable<any[]> {
    let url = `${this.apiUrl}/reservations-by-day`;
    
    // Add date range parameters if provided
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    
    return this.http.get<any[]>(url, this.getAuthHeaders());
  }

  // Get recent reservations
  getRecentReservations(limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent-reservations?limit=${limit}`, this.getAuthHeaders());
  }
}