import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-reservations-by-day',
  standalone: true,
  imports: [CommonModule, ChartModule, SkeletonModule],
  template: `
    <div *ngIf="isLoading" class="flex align-items-center justify-content-center" style="height: 300px;">
      <p-skeleton width="100%" height="300px"></p-skeleton>
    </div>
    
    <div *ngIf="!isLoading" class="chart-container">
      <p-chart type="bar" [data]="chartData" [options]="chartOptions" width="100%" height="300px"></p-chart>
    </div>
  `
})
export class ReservationsByDayComponent implements OnChanges {
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
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Reservations'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Day of Week'
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
          label: 'Reservations',
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
    
    // Sort the days in correct order (Monday to Sunday)
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedData = [...this.data].sort((a, b) => {
      return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
    });
    
    const labels = sortedData.map(item => item.dayOfWeek);
    const values = sortedData.map(item => item.count);
    
    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Reservations',
          data: values,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }
      ]
    };
  }
}