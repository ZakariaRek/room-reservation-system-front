import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule],
  template: `
    <div class="flex flex-column md:flex-row w-full mt-4 gap-3">
      <!-- Total Rooms Card -->
      <div class="flex-1 mb-3 md:mb-0">
        <div class="card shadow-2 border-round h-full mb-0 surface-card">
          <div class="flex justify-content-between mb-2">
            <div>
              <span class="block text-500 font-medium mx-2 mb-2">Total Rooms</span>
              <div class="text-900 font-medium text-xl" *ngIf="!isLoading">{{ stats.totalRooms || 0 }}</div>
              <p-skeleton width="3rem" height="1.5rem" *ngIf="isLoading"></p-skeleton>
            </div>
           
              <i class="pi pi-home text-blue-500 text-xl"></i>
          </div>
          <span class="text-500 text-sm" *ngIf="!isLoading">Total rooms in the system</span>
        </div>
      </div>

      <!-- Total Reservations Card -->
      <div class="flex-1 mb-3 md:mb-0">
        <div class="card shadow-2 border-round h-full mb-0 surface-card">
          <div class="flex justify-content-between mb-2">
            <div>
              <span class="block text-500 font-medium mb-2 mx-2">Total Reservations</span>
              <div class="text-900 font-medium text-xl" *ngIf="!isLoading">{{ stats.totalReservations || 0 }}</div>
              <p-skeleton width="4rem" height="2.5rem" *ngIf="isLoading"></p-skeleton>
            </div>
              <i class="pi pi-calendar  text-green-500 text-2xl"></i>
          </div>
          <span class="text-500 text-sm" *ngIf="!isLoading">
            <span class="text-green-500 font-semibold">{{ stats.confirmedReservations || 0 }}</span> confirmed
          </span>
        </div>
      </div>

      <!-- Total Users Card -->
      <div class="flex-1 mb-3 md:mb-0">
        <div class="card shadow-2 border-round h-full mb-0 surface-card">
          <div class="flex justify-content-between mb-2">
            <div>
              <span class="block text-500 font-medium mx-2 mb-2">Total Users</span>
              <div class="text-900 font-medium text-xl" *ngIf="!isLoading">{{ stats.totalUsers || 0 }}</div>
              <p-skeleton width="3rem" height="1.5rem" *ngIf="isLoading"></p-skeleton>
            </div>
              <i class="pi pi-users text-purple-500 text-xl"></i>
          </div>
          <span class="text-500 text-sm" *ngIf="!isLoading">System users with access</span>
        </div>
      </div>

      <!-- Today's Reservations Card -->
      <div class="flex-1 mb-3 md:mb-0">
        <div class="card shadow-2 border-round h-full mb-0 surface-card">
          <div class="flex justify-content-between mb-2">
            <div>
              <span class="block text-500 font-medium mx-2 mb-2">Today's Reservations</span>
              <div class="text-900 font-medium text-xl" *ngIf="!isLoading">{{ stats.todayReservations || 0 }}</div>
              <p-skeleton width="3rem" height="1.5rem" *ngIf="isLoading"></p-skeleton>
            </div>
              <i class=" pi pi-calendar-plus text-orange-500 text-xl"></i>
          </div>
          <span class="text-500 text-sm" *ngIf="!isLoading">
            This week: <span class="text-orange-500 font-semibold">{{ stats.weekReservations || 0 }}</span>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shadow-2 {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s ease;
    }
    
    .shadow-2:hover {
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    
    :host ::ng-deep .card {
      margin-bottom: 0;
      height: 100%;
      border-radius: 8px;
    }
    
    @media screen and (max-width: 768px) {
      .flex-1 {
        min-width: 100%;
      }
    }
  `]
})
export class StatsWidgetComponent {
  @Input() stats: any = {};
  @Input() isLoading: boolean = true;
}