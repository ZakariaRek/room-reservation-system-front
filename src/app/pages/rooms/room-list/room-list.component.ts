import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room, RoomService } from '../../../services/room.service';
import { Equipment } from '../../../models/equipment.model';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    standalone: true,
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss'],
    providers: [ConfirmationService, MessageService],
    imports: [
        CommonModule,
        DialogModule,
        TableModule,
        PanelModule,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
        HttpClientModule,
        DropdownModule,
        RouterLink
    ]
})
export class RoomListComponent implements OnInit {
    rooms: Room[] = [];
    equipmentsByRoomId: { [key: number]: Equipment[] } = {};
    displayEquipmentsDialog = false;
    selectedEquipments: Equipment[] = [];

    constructor(
        private roomService: RoomService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}


showEquipments(roomId: number): void {
    this.roomService.getEquipmentsByRoom(roomId).subscribe(equipments => {
        this.selectedEquipments = equipments;
        this.displayEquipmentsDialog = true;
    });
}

    ngOnInit(): void {
        this.loadRooms();
    }

    loadRooms(): void {
        this.roomService.getAll().subscribe({
            next: (data: Room[]) => {
                this.rooms = data;
            },
            error: (err) => {
                console.error('❌ Erreur lors du chargement des salles :', err);
            }
        });
    }

    deleteRoom(id: number): void {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir supprimer la salle n°${id} ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.roomService.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Supprimée',
                            detail: `La salle ${id} a été supprimée.`
                        });
                        this.loadRooms();
                    },
                    error: (err) => {
                        console.error('Erreur lors de la suppression :', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de supprimer la salle.'
                        });
                    }
                });
            }
        });
    }


}
