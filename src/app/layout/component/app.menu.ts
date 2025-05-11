import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];
    isAdmin: boolean = false;

    constructor(private authService: AuthService) {
        // Check if user is admin on component creation
        this.isAdmin = this.authService.isAdmin();
    }

    ngOnInit() {
        // Create base menu items that are visible to all users
        let homeItems = [
            // { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
            {
                label: 'Event Calendar',
                icon: 'pi pi-calendar',
                routerLink: ['/calendar']
            }
        ];

        // Add the Users menu item only for admins
        if (this.isAdmin) {
            homeItems.splice(1, 0, { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] });

            homeItems.splice(1, 0, {
                label: 'Users',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/admin/users']
            });
        }

        this.model = [
            {
                label: 'Home',
                items: homeItems
            },
            {
                label: 'Github',
                items: [
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/ZakariaRek/room-reservation-system-auth-service',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
