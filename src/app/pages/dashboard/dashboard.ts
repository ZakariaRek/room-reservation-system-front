import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsWidgetComponent } from './components/stats-widget.component';
import { ReservationsChartComponent } from './components/reservations-chart.component';
import { RoomUtilizationComponent } from './components/room-utilization.component';
import { RecentReservationsComponent } from './components/recent-reservations.component';
import { ReservationsByDayComponent } from './components/reservations-by-day.component';
import { DashboardService } from '../../services/dashboard.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsWidgetComponent,
    ReservationsChartComponent,
    RoomUtilizationComponent,
    RecentReservationsComponent,
    ReservationsByDayComponent,
    ToastModule,
    CardModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12">
        <div class="card mb-3 shadow-1 border-round">
          <div class="flex align-items-center justify-content-between">
            <div class="hidden md:flex align-items-center justify-content-between w-full">
              <div>
                <h3 class="text-xl font-medium mb-2">Room Reservation Dashboard</h3>
                <p class="text-500 mb-0">Monitor your reservation system's performance at a glance</p>
              </div></div>
              <div>
                <!-- Illustration -->
                <div class="hidden md:flex justify-content-end">
                  <img src="assets/layout/dashboard-illustration.svg" alt="Dashboard" width="250" height="100" />
                </div>
                <!-- Mobile view (SVG hidden) -->
            </div>
            <!-- Mobile view (SVG hidden) -->
            <div class="flex md:hidden">
              <h3 class="text-xl font-medium mb-2">Room Reservation Dashboard</h3>
            </div>
            <div class="hidden md:flex justify-content-end">
              <!-- Right side content can go here if needed -->
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats Cards in One Row -->
      <div class="col-12 mb-3">
        <app-stats-widget [stats]="stats" [isLoading]="isLoading" class="w-full"></app-stats-widget>
      </div>
      
      <!-- Recent Reservations & Status Distribution -->
      <div class="col-12 lg:col-4 order-2 lg:order-1">
        <div class="card shadow-2 border-round mb-3">
          <h5 class="text-xl font-medium">Recent Reservations</h5>
          <app-recent-reservations [data]="recentReservations" [isLoading]="isLoading"></app-recent-reservations>
        </div>
        
        <div class="card shadow-2 border-round">
          <h5 class="text-xl font-medium">Reservations by Status</h5>
          <app-reservations-chart [data]="reservationsByStatus" [isLoading]="isLoading"></app-reservations-chart>
        </div>
      </div>
      
      <!-- Main Charts and Visualizations -->
      <div class="col-12 lg:col-8 order-1 lg:order-2">
        <div class="card shadow-2 border-round mb-3">
          <h5 class="text-xl font-medium">Room Utilization</h5>
          <app-room-utilization [data]="roomUtilization" [isLoading]="isLoading"></app-room-utilization>
        </div>
        
        <div class="card shadow-2 border-round">
          <h5 class="text-xl font-medium">Reservations by Day of Week</h5>
          <app-reservations-by-day [data]="reservationsByDay" [isLoading]="isLoading"></app-reservations-by-day>
        </div>
      </div>
    </div>
    
    <p-toast position="top-right"></p-toast>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      margin-bottom: 1rem;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
    }
    
    /* Card shadow enhancements */
    .shadow-1 {
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .shadow-2 {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s ease;
    }
    
    .shadow-2:hover {
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Data properties
  stats: any = {};
  reservationsByStatus: any[] = [];
  roomUtilization: any[] = [];
  reservationsByDay: any[] = [];
  recentReservations: any[] = [];
  
  // Loading state
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load stats
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log(data);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard statistics'
        });
      }
    });
    
    // Load reservations by status
    this.dashboardService.getReservationsByStatus().subscribe({
      next: (data) => {
        this.reservationsByStatus = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reservations by status data'
        });
      }
    });
    
    // Load room utilization
    this.dashboardService.getRoomUtilization().subscribe({
      next: (data) => {
        this.roomUtilization = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load room utilization data'
        });
      }
    });
    
    // Load reservations by day
    this.dashboardService.getReservationsByDay().subscribe({
      next: (data) => {
        this.reservationsByDay = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reservations by day data'
        });
      }
    });
    
    // Load recent reservations
    this.dashboardService.getRecentReservations().subscribe({
      next: (data) => {
        this.recentReservations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load recent reservations'
        });
        this.isLoading = false;
      }
    });
  }
}