import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
    TooltipModule,
    CheckboxModule,
    DropdownModule,
    RadioButtonModule
  ],
  providers: [MessageService],
  template: `
  
    <div class="card overflow-auto">
      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row justify-between items-center mb-2">
          <div class="font-semibold text-lg">Reservation Calendar</div>
          <div class="flex flex-wrap gap-1 justify-end">
            <p-button icon="pi pi-plus" (click)="openReservationDialog()" severity="success" size="small" class="flex md:hidden"></p-button>
            <p-button label="Add Reservation" icon="pi pi-plus" (click)="openReservationDialog()" severity="success" size="small" class="hidden md:flex"></p-button>
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
      
      <!-- Reservation Dialog -->
      <p-dialog 
        [(visible)]="reservationDialogVisible" 
        [style]="{width: '95vw', maxWidth: '550px'}" 
        [breakpoints]="{'960px': '80vw', '640px': '90vw'}"
        [contentStyle]="{overflow: 'visible'}"
        header="Reservation Details" 
        [modal]="true" 
        styleClass="p-fluid reservation-dialog"
        [closeOnEscape]="true"
        [draggable]="false"
        [resizable]="false">
        
        <ng-template pTemplate="content">
          <form [formGroup]="reservationForm">
            <div class="grid formgrid p-0">
              <div class="col-12 field mb-3">
                <label for="room" class="block text-sm font-medium mb-1">Room</label>
                <p-dropdown 
                  id="room" 
                  [options]="rooms" 
                  formControlName="roomId" 
                  optionLabel="name" 
                  optionValue="id" 
                  [filter]="true" 
                  filterBy="name" 
                  [showClear]="true" 
                  placeholder="Select a Room"
                  (onChange)="onRoomChange()">
                </p-dropdown>
                <small *ngIf="reservationForm.get('roomId')?.hasError('required') && reservationForm.get('roomId')?.touched" class="p-error">Room is required</small>
              </div>
              
              <div class="col-12 field mb-2">
                <div class="flex align-items-center gap-2 mb-2">
                  <p-checkbox formControlName="allDay" [binary]="true" inputId="allDay" (onChange)="onAllDayChange()"></p-checkbox>
                  <label for="allDay" class="text-sm font-medium">All Day</label>
                </div>
              </div>
              
              <div class="col-12 field mb-3">
                <label for="date" class="block text-sm font-medium mb-1">Date</label>
                <p-calendar 
                  id="date" 
                  formControlName="date" 
                  [showIcon]="true" 
                  [showButtonBar]="true" 
                  dateFormat="yy-mm-dd"
                  [touchUI]="isMobile"
                  appendTo="body"
                  (onSelect)="onDateChange()">
                </p-calendar>
                <small *ngIf="reservationForm.get('date')?.hasError('required') && reservationForm.get('date')?.touched" class="p-error">Date is required</small>
              </div>
              
              <div *ngIf="!reservationForm.get('allDay')?.value" class="col-12 field mb-3">
                <label class="block text-sm font-medium mb-1">Available Time Slots</label>
                <div class="grid">
                  <div *ngFor="let slot of availableTimeSlots" class="col-12 md:col-6 mb-2">
                    <div class="p-field-radiobutton">
                      <p-radioButton 
                        [inputId]="'slot_' + slot.fromTime" 
                        name="timeSlot" 
                        [value]="slot" 
                        [(ngModel)]="selectedTimeSlot" 
                        [ngModelOptions]="{standalone: true}"
                        (onClick)="onTimeSlotSelect(slot)">
                      </p-radioButton>
                      <label [for]="'slot_' + slot.fromTime" class="ml-2">
                        {{ formatTime(slot.fromTime) }} - {{ formatTime(slot.toTime) }}
                      </label>
                    </div>
                  </div>
                  <div *ngIf="availableTimeSlots.length === 0 && reservationForm.get('date')?.valid && reservationForm.get('roomId')?.valid" class="col-12">
                    <p class="text-sm text-orange-500">No available time slots for this date and room</p>
                  </div>
                </div>
                <small *ngIf="reservationForm.get('fromtime')?.hasError('required') && reservationForm.get('fromtime')?.touched" class="p-error">Time slot is required</small>
              </div>
            </div>
          </form>
        </ng-template>
        
        <ng-template pTemplate="footer">
          <div class="flex justify-between w-full">
            <p-button *ngIf="!isNewReservation" label="Delete" icon="pi pi-trash" severity="danger" (click)="deleteReservation()" size="small"></p-button>
            <div class="flex gap-2">
              <p-button label="Cancel" icon="pi pi-times" (click)="reservationDialogVisible = false" size="small" [text]="true"></p-button>
              <p-button label="Save" icon="pi pi-check" (click)="saveReservation()" [disabled]="!reservationForm.valid" size="small"></p-button>
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
    
    ::ng-deep .fc-event-pending {
      background-color: #FFA726 !important;
      border-color: #FB8C00 !important;
    }
    
    ::ng-deep .fc-event-confirmed {
      background-color: #66BB6A !important;
      border-color: #43A047 !important;
    }
    
    ::ng-deep .fc-event-cancelled {
      background-color: #EF5350 !important;
      border-color: #E53935 !important;
      text-decoration: line-through;
    }
    
    ::ng-deep .reservation-dialog .p-dialog-content {
      padding: 1rem 1.5rem;
    }
    
    ::ng-deep .reservation-dialog .p-dialog-footer {
      padding: 0.75rem 1.5rem 1.5rem;
    }
    
    ::ng-deep .reservation-dialog .p-dialog-header {
      padding: 1.5rem 1.5rem 0.5rem;
    }
    
    @media screen and (max-width: 768px) {
      ::ng-deep .fc-toolbar-title {
        font-size: 1rem !important;
      }
      
      ::ng-deep .fc-daygrid-day-number, 
      ::ng-deep .fc-daygrid-day-top {
        font-size: 0.75rem !important;
      }
      
      ::ng-deep .reservation-dialog .p-dialog-content {
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
    editable: false, // Disable dragging
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [], // Initial empty events
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventClassNames: (arg) => {
      // Add different classes based on reservation status
      return [`fc-event-${arg.event.extendedProps['status']?.toLowerCase()}`];
    }
  };

  reservationDialogVisible: boolean = false;
  isNewReservation: boolean = true;
  isMobile: boolean = false;
  
  // Form data
  reservationForm: FormGroup;
  rooms: any[] = [];
  availableTimeSlots: any[] = [];
  selectedTimeSlot: any = null;
  
  // User info
  currentUserId: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    // Check if we're on mobile for calendar touchUI
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
    
    // Initialize form
    this.reservationForm = this.fb.group({
      id: [null],
      roomId: [null, Validators.required],
      date: [null, Validators.required],
      fromtime: [null],
      totime: [null],
      allDay: [false],
      status: ['PENDING']
    });
    
    // Add conditional validation for time fields
    this.reservationForm.get('allDay')?.valueChanges.subscribe((isAllDay) => {
      if (isAllDay) {
        this.reservationForm.get('fromtime')?.clearValidators();
        this.reservationForm.get('totime')?.clearValidators();
      } else {
        this.reservationForm.get('fromtime')?.setValidators(Validators.required);
        this.reservationForm.get('totime')?.setValidators(Validators.required);
      }
      this.reservationForm.get('fromtime')?.updateValueAndValidity();
      this.reservationForm.get('totime')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    // Get current user info
    if (this.authService.currentUserValue) {
      this.currentUserId = this.authService.currentUserValue.id;
      this.isAdmin = this.authService.isAdmin();
    }
    
    // Load rooms
    this.loadRooms();
    
    // Load reservations based on user role
    this.loadReservations();
  }
  
  loadRooms() {
    this.roomService.getRooms().subscribe(
      (rooms) => {
        this.rooms = rooms;
        console.log(rooms);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load rooms'
        });
      }
    );
  }
  
  loadReservations() {
    if (this.isAdmin) {
      // Admin sees all confirmed reservations
      this.reservationService.getConfirmedReservations().subscribe(
        (reservations) => {
          this.updateCalendarEvents(reservations);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load reservations'
          });
        }
      );
    } else if (this.currentUserId) {
      // Regular users see only their own reservations
      this.reservationService.getReservationsByUserId(this.currentUserId).subscribe(
        (reservations) => {
          this.updateCalendarEvents(reservations);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load your reservations'
          });
        }
      );
    }
  }
  
  updateCalendarEvents(reservations: any[]) {
    const events: EventInput[] = reservations.map(reservation => {
      // Get the room name if available
      const roomName = this.rooms.find(r => r.id === reservation.roomId)?.name || `Room ${reservation.roomId}`;
      
      return {
        id: reservation.id.toString(),
        title: `${roomName}`,
        start: `${reservation.date}T${reservation.fromtime || '08:00:00'}`,
        end: `${reservation.date}T${reservation.totime || '21:00:00'}`,
        allDay: !reservation.fromtime || !reservation.totime,
        extendedProps: {
          roomId: reservation.roomId,
          userId: reservation.userId,
          status: reservation.status
        }
      };
    });
    
    // Update the calendar events
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    calendarApi.addEventSource(events);
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
    this.isNewReservation = true;
    this.reservationForm.reset({
      allDay: false,
      status: 'PENDING'
    });
    
    // Set the date
    this.reservationForm.patchValue({
      date: new Date(arg.date)
    });
    
    this.reservationDialogVisible = true;
  }

  handleEventClick(arg: EventClickArg) {
    this.isNewReservation = false;
    
    // Reset the form and available time slots
    this.reservationForm.reset();
    this.availableTimeSlots = [];
    this.selectedTimeSlot = null;
    
    // Get the reservation details
    const reservationId = parseInt(arg.event.id);
    this.reservationService.getReservationById(reservationId).subscribe(
      (reservation) => {
        // Check if the user is allowed to edit this reservation
        if (this.isAdmin || reservation.userId === this.currentUserId) {
          const isAllDay = !reservation.fromtime || !reservation.totime;
          
          this.reservationForm.patchValue({
            id: reservation.id,
            roomId: reservation.roomId,
            date: new Date(reservation.date),
            fromtime: reservation.fromtime,
            totime: reservation.totime,
            allDay: isAllDay,
            status: reservation.status
          });
          
          // If not all day, load available time slots for this date and room
          if (!isAllDay && reservation.date && reservation.roomId) {
            this.loadAvailableTimeSlots(new Date(reservation.date), reservation.roomId, reservationId);
          }
          
          this.reservationDialogVisible = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You can only view details of your own reservations'
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reservation details'
        });
      }
    );
  }
  
  openReservationDialog() {
    this.isNewReservation = true;
    this.reservationForm.reset({
      allDay: false,
      status: 'PENDING'
    });
    
    this.availableTimeSlots = [];
    this.selectedTimeSlot = null;
    this.reservationDialogVisible = true;
  }
  
  onRoomChange() {
    // When room is selected, load available time slots if date is also selected
    const date = this.reservationForm.get('date')?.value;
    const roomId = this.reservationForm.get('roomId')?.value;
    
    if (date && roomId && !this.reservationForm.get('allDay')?.value) {
      this.loadAvailableTimeSlots(date, roomId);
    }
  }
  
  onDateChange() {
    // When date is selected, load available time slots if room is also selected
    const date = this.reservationForm.get('date')?.value;
    const roomId = this.reservationForm.get('roomId')?.value;
    
    if (date && roomId && !this.reservationForm.get('allDay')?.value) {
      this.loadAvailableTimeSlots(date, roomId);
    }
  }
  
  onAllDayChange() {
    const isAllDay = this.reservationForm.get('allDay')?.value;
    
    if (isAllDay) {
      // If all day is selected, clear time slot values
      this.reservationForm.patchValue({
        fromtime: null,
        totime: null
      });
      this.selectedTimeSlot = null;
    } else {
      // If not all day, load available time slots
      const date = this.reservationForm.get('date')?.value;
      const roomId = this.reservationForm.get('roomId')?.value;
      
      if (date && roomId) {
        this.loadAvailableTimeSlots(date, roomId);
      }
    }
  }
  
  loadAvailableTimeSlots(date: Date, roomId: number, excludeReservationId?: number) {
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    this.reservationService.getAvailableTimeSlots(formattedDate, roomId).subscribe(
      (slots) => {
        this.availableTimeSlots = slots;
        
        // If we have an existing reservation, add it to available slots
        if (excludeReservationId) {
          const fromtime = this.reservationForm.get('fromtime')?.value;
          const totime = this.reservationForm.get('totime')?.value;
          
          if (fromtime && totime) {
            const existingSlot = {
              fromTime: fromtime,
              toTime: totime,
              available: true
            };
            
            // Check if this slot already exists
            const exists = this.availableTimeSlots.some(
              slot => slot.fromTime === fromtime && slot.toTime === totime
            );
            
            if (!exists) {
              this.availableTimeSlots.push(existingSlot);
            }
            
            // Select the existing slot
            this.selectedTimeSlot = existingSlot;
            this.onTimeSlotSelect(existingSlot);
          }
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load available time slots'
        });
      }
    );
  }
  
  onTimeSlotSelect(slot: any) {
    this.reservationForm.patchValue({
      fromtime: slot.fromTime,
      totime: slot.toTime
    });
  }
  
  saveReservation() {
    if (this.reservationForm.invalid) {
      return;
    }
    
    // Get form values
    const formValues = this.reservationForm.value;
    
    // Format date as YYYY-MM-DD
    const formattedDate = formValues.date.toISOString().split('T')[0];
    
    // Create reservation request
    const reservationRequest = {
      date: formattedDate,
      fromtime: formValues.allDay ? null : formValues.fromtime,
      totime: formValues.allDay ? null : formValues.totime,
      allDay: formValues.allDay,
      roomId: formValues.roomId,
      userId: this.currentUserId,
      status: formValues.status
    };
    
    if (this.isNewReservation) {
      // Create new reservation
      this.reservationService.createReservation(reservationRequest).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reservation created successfully'
          });
          
          this.reservationDialogVisible = false;
          this.loadReservations(); // Reload reservations
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create reservation'
          });
        }
      );
    } else {
      // Update existing reservation
      const id = formValues.id;
      this.reservationService.updateReservation(id, reservationRequest).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reservation updated successfully'
          });
          
          this.reservationDialogVisible = false;
          this.loadReservations(); // Reload reservations
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update reservation'
          });
        }
      );
    }
  }
  
  deleteReservation() {
    const id = this.reservationForm.get('id')?.value;
    
    if (id) {
      this.reservationService.deleteReservation(id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reservation deleted successfully'
          });
          
          this.reservationDialogVisible = false;
          this.loadReservations(); // Reload reservations
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete reservation'
          });
        }
      );
    }
  }
  
  // Format time for display (HH:MM:SS -> HH:MM AM/PM)
  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
  }
}