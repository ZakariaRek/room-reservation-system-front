import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
    TooltipModule,
    CheckboxModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row justify-between items-center mb-2">
          <div class="font-semibold text-lg">Event Calendar</div>
          <div class="flex flex-wrap gap-1 justify-end">
            <p-button icon="pi pi-plus" (click)="openEventDialog()" severity="success" size="small" class="flex md:hidden"></p-button>
            <p-button label="Add Event" icon="pi pi-plus" (click)="openEventDialog()" severity="success" size="small" class="hidden md:flex"></p-button>
          </div>
        </div>
        
        <!-- Calendar Controls -->
        <div class="flex flex-wrap gap-1 mb-2">
          <div class="flex gap-1">
            <p-button icon="pi pi-th-large" (click)="changeView('dayGridMonth')" [outlined]="calendarOptions.initialView !== 'dayGridMonth'" 
              size="small" class="flex md:hidden" pTooltip="Month View"></p-button>
            <p-button label="Month" icon="pi pi-th-large" (click)="changeView('dayGridMonth')" [outlined]="calendarOptions.initialView !== 'dayGridMonth'" 
              size="small" class="hidden md:flex"></p-button>
              
            <p-button icon="pi pi-list" (click)="changeView('timeGridWeek')" [outlined]="calendarOptions.initialView !== 'timeGridWeek'" 
              size="small" class="flex md:hidden" pTooltip="Week View"></p-button>
            <p-button label="Week" icon="pi pi-list" (click)="changeView('timeGridWeek')" [outlined]="calendarOptions.initialView !== 'timeGridWeek'" 
              size="small" class="hidden md:flex"></p-button>
              
            <p-button icon="pi pi-calendar" (click)="changeView('timeGridDay')" [outlined]="calendarOptions.initialView !== 'timeGridDay'" 
              size="small" class="flex md:hidden" pTooltip="Day View"></p-button>
            <p-button label="Day" icon="pi pi-calendar" (click)="changeView('timeGridDay')" [outlined]="calendarOptions.initialView !== 'timeGridDay'" 
              size="small" class="hidden md:flex"></p-button>
          </div>
        </div>
        
        <!-- Calendar -->
        <div class="calendar-container" style="height: calc(100vh - 230px); min-height: 400px;">
          <full-calendar #calendar [options]="calendarOptions"></full-calendar>
        </div>
      </div>
      
      <!-- Event Dialog -->
      <p-dialog 
        [(visible)]="eventDialogVisible" 
        [style]="{width: '95vw', maxWidth: '450px'}" 
        [breakpoints]="{'960px': '80vw', '640px': '90vw'}"
        [contentStyle]="{overflow: 'visible'}"
        header="Event Details" 
        [modal]="true" 
        styleClass="p-fluid event-dialog"
        [closeOnEscape]="true"
        [draggable]="false"
        [resizable]="false">
        
        <ng-template pTemplate="content">
          <div class="grid formgrid p-0">
            <div class="col-12 field mb-3">
              <label for="title" class="block text-sm font-medium mb-1">Title</label>
              <input type="text" pInputText id="title" [(ngModel)]="currentEvent.title" required autofocus class="w-full" />
            </div>
            
            <div class="col-12 field mb-2">
              <div class="flex align-items-center gap-2 mb-2">
                <p-checkbox [(ngModel)]="currentEvent.allDay" [binary]="true" inputId="allDay"></p-checkbox>
                <label for="allDay" class="text-sm font-medium">All Day</label>
              </div>
            </div>
            
            <div class="col-12 md:col-6 field mb-3">
              <label for="startDate" class="block text-sm font-medium mb-1">Start</label>
              <p-calendar 
                id="startDate" 
                [(ngModel)]="currentEvent.start" 
                [showTime]="!currentEvent.allDay" 
                [timeOnly]="false" 
                [showIcon]="true" 
                [showButtonBar]="true" 
                class="w-full"
                [touchUI]="isMobile"
                appendTo="body">
              </p-calendar>
            </div>
            
            <div class="col-12 md:col-6 field mb-3">
              <label for="endDate" class="block text-sm font-medium mb-1">End</label>
              <p-calendar 
                id="endDate" 
                [(ngModel)]="currentEvent.end" 
                [showTime]="!currentEvent.allDay" 
                [timeOnly]="false" 
                [showIcon]="true" 
                [showButtonBar]="true" 
                class="w-full"
                [touchUI]="isMobile"
                appendTo="body">
              </p-calendar>
            </div>
            
            
          </div>
        </ng-template>
        
        <ng-template pTemplate="footer">
          <div class="flex justify-between w-full">
            <p-button *ngIf="!isNewEvent" label="Delete" icon="pi pi-trash" severity="danger" (click)="deleteEvent()" size="small"></p-button>
            <div class="flex gap-2">
              <p-button label="Cancel" icon="pi pi-times" (click)="eventDialogVisible = false" size="small" [text]="true"></p-button>
              <p-button label="Save" icon="pi pi-check" (click)="saveEvent()" size="small"></p-button>
            </div>
          </div>
        </ng-template>
      </p-dialog>
      
      <p-toast position="top-right"></p-toast>
    </div>
  `,
  styles: [`
    ::ng-deep .fc-toolbar-title {
      font-size: 1.2rem !important;
      margin: 0 !important;
    }
    
    ::ng-deep .fc-header-toolbar {
      margin-bottom: 0.5rem !important;
    }
    
    ::ng-deep .fc-button {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.875rem !important;
    }
    
    ::ng-deep .fc-daygrid-day-number,
    ::ng-deep .fc-daygrid-day-top {
      font-size: 0.875rem !important;
    }
    
    ::ng-deep .fc-event {
      font-size: 0.75rem !important;
    }
    
    ::ng-deep .event-dialog .p-dialog-content {
      padding: 1rem 1.5rem;
    }
    
    ::ng-deep .event-dialog .p-dialog-footer {
      padding: 0.75rem 1.5rem 1.5rem;
    }
    
    ::ng-deep .event-dialog .p-dialog-header {
      padding: 1.5rem 1.5rem 0.5rem;
    }
    
    ::ng-deep p-calendar .p-calendar {
      width: 100%;
    }
    
    @media screen and (max-width: 768px) {
      ::ng-deep .fc-toolbar-title {
        font-size: 1rem !important;
      }
      
      ::ng-deep .fc-daygrid-day-number, 
      ::ng-deep .fc-daygrid-day-top {
        font-size: 0.75rem !important;
      }
      
      ::ng-deep .event-dialog .p-dialog-content {
        padding: 1rem;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: false, // We're creating our own header buttons
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [], // Initial empty events
    dateClick: this.handleDateClick.bind(this),
    eventClick: (arg: EventClickArg) => {
      this.handleEventClick({
        event: {
          id: arg.event.id || '',
          title: arg.event.title,
          start: arg.event.start || new Date(),
          end: arg.event.end,
          allDay: arg.event.allDay,

        }
      });
    },
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this)
  };

  // Sample initial events
  events: EventInput[] = [
    { 
      title: 'Meeting with Client', 
      start: new Date().toISOString().split('T')[0] + 'T10:00:00', 
      end: new Date().toISOString().split('T')[0] + 'T12:00:00',
      extendedProps: {
        description: 'Discuss project requirements'
      }
    },
    { 
      title: 'Team Standup', 
      start: new Date().toISOString().split('T')[0] + 'T14:00:00', 
      end: new Date().toISOString().split('T')[0] + 'T14:30:00',
      extendedProps: {
        description: 'Daily team sync'
      }
    }
  ];

  eventDialogVisible: boolean = false;
  currentEvent: any = {
    id: null,
    title: '',
    start: null,
    end: null,
    allDay: false,
    description: ''
  };
  isNewEvent: boolean = true;
  isMobile: boolean = false;

  constructor(private messageService: MessageService) {
    // Check if we're on mobile for calendar touchUI
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  ngOnInit() {
    // Set initial events
    this.calendarOptions.events = this.events;
  }

  changeView(viewName: string) {
    // Get the API from the ViewChild reference
    const calendarApi = this.calendarComponent.getApi();
    
    // Update both the calendar view and our stored initialView
    calendarApi.changeView(viewName);
    this.calendarOptions.initialView = viewName;
    
    this.messageService.add({
      severity: 'info',
      summary: 'View Changed',
      detail: `Changed to ${viewName} view`
    });
  }

  handleDateClick(arg: DateClickArg) {
    this.isNewEvent = true;
    this.currentEvent = {
      id: this.generateEventId(),
      title: '',
      start: arg.date,
      end: new Date(arg.date.getTime() + 60 * 60 * 1000), // Default 1 hour
      allDay: arg.allDay,
      description: ''
    };
    this.eventDialogVisible = true;
  }

  handleEventClick(arg: { event: { id: string; title: string; start: Date; end: Date | null; allDay: boolean, description?: string } }) {
    this.isNewEvent = false;
    this.currentEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.start,
      end: arg.event.end || new Date(arg.event.start.getTime() + 60 * 60 * 1000),
      allDay: arg.event.allDay,
      description: arg.event.description || ''
    };
    this.eventDialogVisible = true;
  }

  handleEventDrop(arg: EventDropArg) {
    this.messageService.add({
      severity: 'success',
      summary: 'Event Updated',
      detail: `${arg.event.title} was moved`
    });
  }

  handleEventResize(arg: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Event Updated',
      detail: `${arg.event.title} duration was changed`
    });
  }

  saveEvent() {
    if (!this.currentEvent.title.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Event title is required'
      });
      return;
    }

    const calendarApi = this.calendarComponent.getApi();
    
    if (this.isNewEvent) {
      calendarApi.addEvent({
        id: this.currentEvent.id,
        title: this.currentEvent.title,
        start: this.currentEvent.start,
        end: this.currentEvent.end,
        allDay: this.currentEvent.allDay,
        extendedProps: {
          description: this.currentEvent.description
        }
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Event Added',
        detail: 'New event was added to calendar'
      });
    } else {
      const event = calendarApi.getEventById(this.currentEvent.id);
      
      if (event) {
        event.setProp('title', this.currentEvent.title);
        event.setStart(this.currentEvent.start);
        event.setEnd(this.currentEvent.end);
        event.setAllDay(this.currentEvent.allDay);
        event.setExtendedProp('description', this.currentEvent.description);

        this.messageService.add({
          severity: 'success',
          summary: 'Event Updated',
          detail: 'Event was updated successfully'
        });
      }
    }

    this.eventDialogVisible = false;
  }
  
  deleteEvent() {
    if (!this.isNewEvent && this.currentEvent.id) {
      const calendarApi = this.calendarComponent.getApi();
      const event = calendarApi.getEventById(this.currentEvent.id);
      
      if (event) {
        event.remove();
        
        this.messageService.add({
          severity: 'info',
          summary: 'Event Deleted',
          detail: 'Event was removed from calendar'
        });
        
        this.eventDialogVisible = false;
      }
    }
  }

  openEventDialog() {
    this.isNewEvent = true;
    this.currentEvent = {
      id: this.generateEventId(),
      title: '',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), // Default 1 hour
      allDay: false,
      description: ''
    };
    this.eventDialogVisible = true;
  }

  private generateEventId() {
    return 'event-' + Math.random().toString(36).substring(2, 9);
  }
}