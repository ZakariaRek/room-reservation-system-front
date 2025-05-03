import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8083/api/users';
  
  // Mock data for development - remove in production
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Admin User',
      created: '2024-01-01',
      lastLogin: '2024-04-18',
      status: 'active',
      roles: ['ROLE_ADMIN'],
      department: 'IT',
      position: 'System Administrator',
      verified: true,
      activity: 85
    },
    {
      id: 2,
      username: 'jsmith',
      email: 'john.smith@example.com',
      fullName: 'John Smith',
      created: '2024-01-15',
      lastLogin: '2024-04-15',
      status: 'active',
      roles: ['ROLE_USER', 'ROLE_EDITOR'],
      department: 'Marketing',
      position: 'Content Manager',
      verified: true,
      activity: 72
    },
    {
      id: 3,
      username: 'mjohnson',
      email: 'mary.johnson@example.com',
      fullName: 'Mary Johnson',
      created: '2024-02-10',
      lastLogin: '2024-04-17',
      status: 'active',
      roles: ['ROLE_USER'],
      department: 'Sales',
      position: 'Sales Representative',
      verified: true,
      activity: 65
    },
    {
      id: 4,
      username: 'rwilliams',
      email: 'robert.williams@example.com',
      fullName: 'Robert Williams',
      created: '2024-02-25',
      lastLogin: '2024-03-20',
      status: 'inactive',
      roles: ['ROLE_USER'],
      department: 'Finance',
      position: 'Accountant',
      verified: true,
      activity: 30
    },
    {
      id: 5,
      username: 'jbrown',
      email: 'jennifer.brown@example.com',
      fullName: 'Jennifer Brown',
      created: '2024-03-05',
      lastLogin: '2024-04-10',
      status: 'active',
      roles: ['ROLE_USER', 'ROLE_MANAGER'],
      department: 'HR',
      position: 'HR Manager',
      verified: true,
      activity: 80
    },
    {
      id: 6,
      username: 'dlee',
      email: 'david.lee@example.com',
      fullName: 'David Lee',
      created: '2024-03-15',
      lastLogin: null,
      status: 'pending',
      roles: ['ROLE_USER'],
      department: 'Operations',
      position: 'Operations Analyst',
      verified: false,
      activity: 10
    },
    {
      id: 7,
      username: 'sgarcia',
      email: 'sarah.garcia@example.com',
      fullName: 'Sarah Garcia',
      created: '2024-03-28',
      lastLogin: '2024-04-05',
      status: 'active',
      roles: ['ROLE_USER'],
      department: 'Customer Support',
      position: 'Support Specialist',
      verified: true,
      activity: 60
    },
    {
      id: 8,
      username: 'mmiller',
      email: 'michael.miller@example.com',
      fullName: 'Michael Miller',
      created: '2024-04-01',
      lastLogin: '2024-04-18',
      status: 'active',
      roles: ['ROLE_USER', 'ROLE_EDITOR'],
      department: 'Product',
      position: 'Product Manager',
      verified: true,
      activity: 90
    },
    {
      id: 9,
      username: 'ecooper',
      email: 'emma.cooper@example.com',
      fullName: 'Emma Cooper',
      created: '2024-04-10',
      lastLogin: null,
      status: 'pending',
      roles: ['ROLE_USER'],
      department: 'Marketing',
      position: 'Marketing Specialist',
      verified: false,
      activity: 5
    },
    {
      id: 10,
      username: 'tkim',
      email: 'thomas.kim@example.com',
      fullName: 'Thomas Kim',
      created: '2024-04-15',
      lastLogin: '2024-04-17',
      status: 'active',
      roles: ['ROLE_USER', 'ROLE_MANAGER'],
      department: 'Engineering',
      position: 'Engineering Lead',
      verified: true,
      activity: 85
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // For development, use mock data
    // In production, replace with: return this.http.get<User[]>(this.apiUrl);
    return of(this.mockUsers);
  }

  getUserById(id: number): Observable<User> {
    // For development, use mock data
    // In production, replace with: return this.http.get<User>(`${this.apiUrl}/${id}`);
    const user = this.mockUsers.find(u => u.id === id);
    return of(user as User);
  }

  createUser(user: User): Observable<User> {
    // For development, use mock data
    // In production, replace with: return this.http.post<User>(this.apiUrl, user);
    const newUser = { ...user, id: this.mockUsers.length + 1 };
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  updateUser(user: User): Observable<User> {
    // For development, use mock data
    // In production, replace with: return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.mockUsers[index] = user;
    }
    return of(user);
  }

  deleteUser(id: number): Observable<void> {
    // For development, use mock data
    // In production, replace with: return this.http.delete<void>(`${this.apiUrl}/${id}`);
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
    }
    return of(undefined);
  }
}