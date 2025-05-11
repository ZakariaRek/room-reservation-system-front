import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-room-utilization',
  standalone: true,
  imports: [CommonModule, ChartModule, SkeletonModule, TableModule],
  template: `
    <div *ngIf="isLoading" class="flex align-items-center justify-content-center" style="height: 300px;">
      <p-skeleton width="100%" height="300px"></p-skeleton>
    </div>
    
    <div *ngIf="!isLoading" class="chart-container flex flex-column">
      <p-chart type="bar" [data]="chartData" [options]="chartOptions"></p-chart>
      
      <p-table [value]="data" styleClass="p-datatable-sm" [paginator]="data.length > 5" [rows]="5"
               [showCurrentPageReport]="true" [rowHover]="true">
        <ng-template pTemplate="header">
          <tr>
            <th>Room</th>
            <th style="width: 25%">Reservations</th>
            <th style="width: 25%">Utilization</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-room>
          <tr>
            <td>{{ room.roomName }}</td>
            <td>{{ room.reservationCount }}</td>
            <td>
              <div class="flex align-items-center">
                <div class="w-6rem mr-2">
                  <div class="surface-300 border-round" style="height: 0.5rem">
                    <div class="bg-primary border-round" 
                         [ngStyle]="{'width': room.utilizationRate + '%', 'height': '0.5rem'}"></div>
                  </div>
                </div>
                <span>{{ room.utilizationRate }}%</span>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="3" class="text-center">No room utilization data available.</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class RoomUtilizationComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() isLoading: boolean = true;
  
  chartData: any;
  chartOptions: any;
  
  constructor() {
    this.initChart();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }
  
  initChart() {
    this.chartOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `Utilization: ${context.raw}%`;
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            callback: (value: any) => value + '%'
          },
          title: {
            display: true,
            text: 'Utilization Rate (%)'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
    
    // Initialize with empty data
    this.chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }
      ]
    };
  }
  
  updateChartData() {
    if (!this.data || this.data.length === 0) {
      return;
    }
    
    // Sort data by utilization rate (descending)
    const sortedData = [...this.data].sort((a, b) => b.utilizationRate - a.utilizationRate);
    
    // Take top 5 for the chart
    const top5Data = sortedData.slice(0, 5);
    
    const labels = top5Data.map(item => item.roomName);
    const values = top5Data.map(item => item.utilizationRate);
    
    this.chartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }
      ]
    };
  }
}