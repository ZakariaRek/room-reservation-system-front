import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8083/api/user'; // Changed from 'api/users' to match backend endpoint
  private storedUser = localStorage.getItem('currentUser') ;
private currentUser = this.storedUser ? JSON.parse(this.storedUser) : null;
  private token = this.currentUser?.accessToken;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // Real API call instead of mock data
  

    return this.http.get<User[]>(this.apiUrl
       , {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }
  );
  }

  getUserById(id: number): Observable<User> {
    
    return this.http.get<User>(`${this.apiUrl}/${id}`   , {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user 
      , {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`
      , {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );
  }
}