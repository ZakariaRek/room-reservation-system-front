import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-reservations-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, SkeletonModule],
  template: `
    <div *ngIf="isLoading" class="flex align-items-center justify-content-center" style="height: 300px;">
      <p-skeleton width="100%" height="300px"></p-skeleton>
    </div>
    
    <div *ngIf="!isLoading" class="chart-container">
      <p-chart type="pie" [data]="chartData" [options]="chartOptions" width="100%" height="300px"></p-chart>
    </div>
  `
})
export class ReservationsChartComponent implements OnChanges {
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
          position: 'bottom'
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
          backgroundColor: [
            '#FFA726',
            '#66BB6A',
            '#EF5350'
          ],
          hoverBackgroundColor: [
            '#FFB74D',
            '#81C784',
            '#E57373'
          ]
        }
      ]
    };
  }
  
  updateChartData() {
    if (!this.data || this.data.length === 0) {
      return;
    }
    
    const labels = this.data.map(item => item.status);
    const values = this.data.map(item => item.count);
    
    this.chartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#FFA726', // Pending (orange)
            '#66BB6A', // Confirmed (green)
            '#EF5350'  // Cancelled (red)
          ],
          hoverBackgroundColor: [
            '#FFB74D',
            '#81C784',
            '#E57373'
          ]
        }
      ]
    };
  }
}