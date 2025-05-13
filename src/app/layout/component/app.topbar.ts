import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule, 
        CommonModule, 
        StyleClassModule, 
        AppConfigurator, 
        OverlayPanelModule,
        BadgeModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        TooltipModule
    ],
    providers: [MessageService],
    template: ` 
        <p-toast position="top-right"></p-toast>
        <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
<img class="img-responsive" src="assets/img/logo (1).png" width="150" height="auto" 
    >            </a>
        </div>
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <!-- Notification Button -->
            <div class="relative" *ngIf="authService.isLoggedIn()">
                <button type="button" class="layout-topbar-action relative" (click)="op.toggle($event)" pTooltip="Notifications" tooltipPosition="bottom">
                    <i class="pi pi-bell" [ngClass]="{'text-orange-500': unreadCount > 0}"></i>
                    <span *ngIf="unreadCount > 0" 
                        class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-bold px-1 shadow-sm border-2 border-white dark:border-surface-900 unread-badge">
                        {{ unreadCount }}
                    </span>
                </button>
                <p-overlayPanel #op [style]="{width: '400px'}" [showCloseIcon]="true">
                    <div class="p-3">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-semibold m-0">Notifications <span *ngIf="unreadCount > 0" class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{{ unreadCount }} unread</span></h3>
                            <button *ngIf="unreadCount > 0" 
                                class="p-link text-primary text-sm font-medium" 
                                (click)="markAllAsRead()">
                                Mark all as read
                            </button>
                        </div>
                        <div *ngIf="notifications.length === 0" class="text-center py-4 text-surface-600">
                            No notifications
                        </div>
                        <div class="notification-list" style="max-height: 400px; overflow-y: auto;">
                            <div *ngFor="let notification of notifications" 
                                class="p-3 mb-2 border-solid border-0 border-b border-surface-200 transition-colors duration-200 hover:bg-surface-100"
                                [ngClass]="{
                                  'bg-surface-100': notification.status === 'PENDING',
                                  'bg-green-50 dark:bg-green-900/20': notification.status === 'CONFIRMED',
                                  'bg-red-50 dark:bg-red-900/20': notification.status === 'CANCELLED'
                                }">
                                <div class="flex flex-col">
                                    <div class="flex">
                                        <div class="mr-3">
                                            <i class="pi" 
                                              [ngClass]="{
                                                'pi-envelope text-primary': notification.status === 'PENDING',
                                                'pi-check-circle text-green-500': notification.status === 'CONFIRMED',
                                                'pi-times-circle text-red-500': notification.status === 'CANCELLED'
                                              }">
                                            </i>
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center mb-1">
                                                <p class="m-0">{{ notification.message }}</p>
                                                <span *ngIf="notification.status === 'CONFIRMED'" 
                                                    class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
                                                <span *ngIf="notification.status === 'CANCELLED'" 
                                                    class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Cancelled</span>
                                            </div>
                                            <span class="text-xs text-surface-500">{{ notification.date | date:'medium' }}</span>
                                        </div>
                                    </div>
                                    <div class="flex justify-end gap-2 mt-3" *ngIf="notification.status === 'PENDING'">
                                        <button pButton pRipple 
                                            type="button" 
                                            label="Confirm" 
                                            class="p-button-sm p-button-success" 
                                            (click)="updateNotificationStatus(notification, 'CONFIRMED')">
                                        </button>
                                        <button pButton pRipple 
                                            type="button" 
                                            label="Cancel" 
                                            class="p-button-sm p-button-danger" 
                                            (click)="updateNotificationStatus(notification, 'CANCELLED')">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </p-overlayPanel>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" routerLink="/calendar">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button *ngIf="!authService.isLoggedIn()" type="button" class="layout-topbar-action" routerLink="/auth/login">
                        <i class="pi pi-sign-in"></i>
                        <span>Login</span>
                    </button>
                    <button *ngIf="!authService.isLoggedIn()" type="button" class="layout-topbar-action" routerLink="/auth/signup">
                        <i class="pi pi-user-plus"></i>
                        <span>Sign Up</span>
                    </button>
                    <button *ngIf="authService.isLoggedIn()" type="button" class="layout-topbar-action" (click)="logout()">
                        <i class="pi pi-sign-out"></i>
                        <span>Logout</span>
                    </button>
                    <button *ngIf="authService.isLoggedIn()" type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    styles: [`
        :host ::ng-deep .p-overlaypanel .p-overlaypanel-content {
            padding: 0;
        }
        
        :host ::ng-deep .p-tooltip {
            opacity: 0.9;
        }
        
        .notification-list::-webkit-scrollbar {
            width: 6px;
        }
        
        .notification-list::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
        }
        
        .notification-list::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
        
        .notification-list::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
        }
        
        .dark .notification-list::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .dark .notification-list::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .dark .notification-list::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .unread-badge {
            animation: pulse 2s infinite;
        }
    `]
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    logoPath = 'assets/img/logo (1).png';
    notifications: Notification[] = [];
    unreadCount: number = 0;

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService,
        private notificationService: NotificationService,
        private reservationService: ReservationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadNotifications();
        // Set up an interval to refresh notifications every minute
        setInterval(() => this.loadNotifications(), 60000);
    }
    
    loadNotifications() {
        if (this.authService.isLoggedIn()) {
            const currentUser = this.authService.currentUserValue;
            if (currentUser) {
                this.notificationService.getNotificationsByReceiverId(currentUser.id).subscribe(
                    (data) => {
                        this.notifications = data.reverse();
                        this.unreadCount = data.filter(n => n.status === 'PENDING').length;
                    },
                    (error) => {
                        console.error('Error loading notifications', error);
                    }
                );
            }
        }
    }
    
    updateNotificationStatus(notification: Notification, status: string) {
        if (notification.status === 'PENDING') {
            // First update the reservation status if there's a reservation ID
            if (notification.reservationId) {
                this.reservationService.updateReservationStatus(notification.reservationId, status).subscribe(
                    () => {
                        // After updating the reservation, update the notification
                        this.updateNotificationOnly(notification, status);
                    },
                    (error) => {
                        console.error(`Error updating reservation status to ${status}`, error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update reservation status',
                            life: 3000
                        });
                    }
                );
            } else {
                // If there's no reservation ID, just update the notification
                this.updateNotificationOnly(notification, status);
            }
        }
    }
    
    private updateNotificationOnly(notification: Notification, status: string) {
        this.notificationService.updateNotificationStatus(notification.id, status).subscribe(
            () => {
                notification.status = status;
                this.unreadCount = this.notifications.filter(n => n.status === 'PENDING').length;
                
                // Show toast message based on status
                if (status === 'CONFIRMED') {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'Notification has been confirmed',
                        life: 3000
                    });
                } else if (status === 'CANCELLED') {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Cancelled',
                        detail: 'Notification has been cancelled',
                        life: 3000
                    });
                }
            },
            (error) => {
                console.error(`Error updating notification status to ${status}`, error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update notification status',
                    life: 3000
                });
            }
        );
    }
    
    markAllAsRead() {
        const pendingNotifications = this.notifications.filter(n => n.status === 'PENDING');
        if (pendingNotifications.length === 0) return;

        let processed = 0;
        pendingNotifications.forEach(notification => {
            this.notificationService.updateNotificationStatus(notification.id, 'CONFIRMED').subscribe(
                () => {
                    notification.status = 'CONFIRMED';
                    processed++;
                    if (processed === pendingNotifications.length) {
                        this.unreadCount = 0;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'All notifications have been marked as confirmed',
                            life: 3000
                        });
                    }
                },
                (error) => {
                    console.error('Error marking notification as read', error);
                    processed++;
                    if (processed === pendingNotifications.length) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update some notifications',
                            life: 3000
                        });
                    }
                }
            );
        });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    
    logout() {
        this.authService.logout();
    }
}