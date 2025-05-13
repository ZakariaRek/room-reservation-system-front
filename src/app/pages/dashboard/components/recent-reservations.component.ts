import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recent-reservations',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, SkeletonModule],
  template: `
    <div *ngIf="isLoading" class="flex align-items-center justify-content-center" style="height: 300px;">
      <p-skeleton width="100%" height="300px"></p-skeleton>
    </div>
    
    <div *ngIf="!isLoading">
      <p-table [value]="data" styleClass="p-datatable-sm" [scrollable]="true" scrollHeight="350px"
               [rowHover]="true">
        <ng-template pTemplate="header">
          <tr>
            <th>Room</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-reservation>
          <tr>
            <td>{{ getRoomName(reservation.roomId) }}</td>
            <td>{{ formatDate(reservation.date) }}</td>
            <td>
              <p-tag 
                [value]="reservation.status" 
                [severity]="getStatusSeverity(reservation.status)">
              </p-tag>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="3" class="text-center">No recent reservations found.</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class RecentReservationsComponent {
  @Input() data: any[] = [];
  @Input() isLoading: boolean = true;
  
  // Method to get room name (would need to be updated with actual room data)
  getRoomName(roomId: number): string {
    // This is a placeholder. In a real app, you'd get the room name from a service or passed data
    return `Room ${roomId}`;
  }
  
  // Format date to display
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  // Get severity class for status tag
  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'PENDING':
        return 'warn'; // Changed from 'warning' to 'warn'
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
}