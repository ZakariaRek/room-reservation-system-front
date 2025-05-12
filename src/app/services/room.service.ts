import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment.model';

export interface Room {
    id?: number;
    name: string;
    capacity: number;
    type?: string;
    createdByUserId?: string;
    equipments?: Equipment[]; // 🔧 Ajoute ce champ ici
}

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    private apiUrl = 'http://localhost:9090/api/rooms';

    constructor(private http: HttpClient) {}

    getAll(): Observable<Room[]> {
        return this.http.get<Room[]>(this.apiUrl);
    }

    getById(id: number): Observable<Room> {
        return this.http.get<Room>(`${this.apiUrl}/${id}`);
    }

    create(room: Room): Observable<Room> {
        return this.http.post<Room>(this.apiUrl, room);
    }

    update(id: number, room: Room): Observable<Room> {
        return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    getEquipmentsByRoom(roomId: number): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/${roomId}/equipments`);
    }
}
