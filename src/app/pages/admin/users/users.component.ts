import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

interface Department {
  name: string;
  code: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    SliderModule,
    ProgressBarModule,
    RippleModule
  ],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
      
      <div class="flex justify-between items-center mb-4">
        <div class="font-semibold text-xl">Users Management</div>
        <button pButton icon="pi pi-plus" label="Add User" class="p-button-success" (click)="openUserDialog()"></button>
      </div>
      
      <p-table 
        #dt 
        [value]="users" 
        dataKey="id" 
        [rows]="10" 
        [loading]="loading" 
        [rowHover]="true" 
        [showGridlines]="true"
        [paginator]="true" 
        [globalFilterFields]="['username', 'email', 'fullName', 'department', 'status', 'position']"
        responsiveLayout="scroll"
      >
        <ng-template pTemplate="caption">
          <div class="flex justify-between items-center flex-column sm:flex-row">
            <button pButton label="Clear" class="p-button-outlined mb-2" icon="pi pi-filter-slash" (click)="clear(dt)"></button>
            <p-iconfield iconPosition="left" class="ml-auto">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search keyword" />
            </p-iconfield>
          </div>
        </ng-template>
        
        <ng-template pTemplate="header">
          <tr>
            <th style="min-width: 12rem">
              <div class="flex justify-between items-center">
                Username
                <p-columnFilter type="text" field="username" display="menu" placeholder="Search by username"></p-columnFilter>
              </div>
            </th>
            <th style="min-width: 14rem">
              <div class="flex justify-between items-center">
                Full Name
                <p-columnFilter type="text" field="fullName" display="menu" placeholder="Search by name"></p-columnFilter>
              </div>
            </th>
            <th style="min-width: 14rem">
              <div class="flex justify-between items-center">
                Email
                <p-columnFilter type="text" field="email" display="menu" placeholder="Search by email"></p-columnFilter>
              </div>
            </th>
            <th style="min-width: 12rem">
              <div class="flex justify-between items-center">
                Department
                <p-columnFilter field="department" matchMode="equals" display="menu">
                  <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                    <p-select [ngModel]="value" [options]="departments" (onChange)="filter($event.value)" placeholder="Any" optionLabel="name" optionValue="name">
                      <ng-template let-option pTemplate="item">
                        <span>{{ option.name }}</span>
                      </ng-template>
                    </p-select>
                  </ng-template>
                </p-columnFilter>
              </div>
            </th>
            <th style="min-width: 12rem">
              <div class="flex justify-between items-center">
                Position
                <p-columnFilter type="text" field="position" display="menu" placeholder="Search by position"></p-columnFilter>
              </div>
            </th>
            <th style="min-width: 10rem">
              <div class="flex justify-between items-center">
                Last Login
                <p-columnFilter type="date" field="lastLogin" display="menu" placeholder="mm/dd/yyyy"></p-columnFilter>
              </div>
            </th>
            <th style="min-width: 10rem">
              <div class="flex justify-between items-center">
                Status
                <p-columnFilter field="status" matchMode="equals" display="menu">
                  <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                    <p-select [ngModel]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any" [style]="{ 'min-width': '12rem' }">
                      <ng-template let-option pTemplate="item">
                        <span [class]="'status-badge status-' + option.value">{{ option.label }}</span>
                      </ng-template>
                    </p-select>
                  </ng-template>
                </p-columnFilter>
              </div>
            </th>
            <th style="min-width: 12rem">
              <div class="flex justify-between items-center">
                Activity
                <p-columnFilter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                  <ng-template pTemplate="filter" let-filter="filterCallback">
                    <p-slider [ngModel]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" styleClass="m-3" [style]="{ 'min-width': '12rem' }"></p-slider>
                    <div class="flex items-center justify-between px-2">
                      <span>{{ activityValues[0] }}</span>
                      <span>{{ activityValues[1] }}</span>
                    </div>
                  </ng-template>
                </p-columnFilter>
              </div>
            </th>
            <th style="min-width: 10rem">
              <div class="flex justify-center items-center">
                Actions
              </div>
            </th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.username }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.position }}</td>
            <td>{{ user.lastLogin ? (user.lastLogin | date: 'MM/dd/yyyy') : 'Never' }}</td>
            <td>
              <p-tag [value]="user.status" [severity]="getSeverity(user.status)" styleClass="dark:!bg-surface-900"></p-tag>
            </td>
            <td>
              <p-progressbar [value]="user.activity" [showValue]="false" [style]="{ height: '0.5rem' }"></p-progressbar>
            </td>
            <td>
              <div class="flex justify-center gap-2">
                <button pButton pRipple icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-sm" (click)="editUser(user)"></button>
                <button pButton pRipple icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" (click)="confirmDelete(user)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="9" class="text-center">No users found.</td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="loadingbody">
          <tr>
            <td colspan="9" class="text-center">Loading users data. Please wait.</td>
          </tr>
        </ng-template>
      </p-table>
      
      <p-dialog [(visible)]="userDialog" [style]="{width: '450px'}" header="User Details" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <div class="field">
            <label for="username">Username</label>
            <input type="text" pInputText id="username" [(ngModel)]="user.username" required autofocus />
          </div>
          <div class="field">
            <label for="fullName">Full Name</label>
            <input type="text" pInputText id="fullName" [(ngModel)]="user.fullName" required />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input type="email" pInputText id="email" [(ngModel)]="user.email" required />
          </div>
          <div class="field">
            <label for="department">Department</label>
            <p-select id="department" [(ngModel)]="user.department" [options]="departments" optionLabel="name" optionValue="name" placeholder="Select a Department"></p-select>
          </div>
          <div class="field">
            <label for="position">Position</label>
            <input type="text" pInputText id="position" [(ngModel)]="user.position" />
          </div>
          <div class="field">
            <label for="status">Status</label>
            <p-select id="status" [(ngModel)]="user.status" [options]="statuses" optionLabel="label" optionValue="value" placeholder="Select Status"></p-select>
          </div>
          <div class="field">
            <label for="verified">Verified</label>
            <div class="flex items-center mt-2">
              <p-select id="verified" [(ngModel)]="user.verified" [options]="[{label: 'Yes', value: true}, {label: 'No', value: false}]" optionLabel="label" optionValue="value"></p-select>
            </div>
          </div>
          <div class="field">
            <label for="roles">Roles</label>
            <p-multiSelect id="roles" [(ngModel)]="selectedRoles" [options]="availableRoles" optionLabel="name" placeholder="Select Roles" 
                         (onChange)="onRoleChange($event)"></p-multiSelect>
          </div>
        </ng-template>
        
        <ng-template pTemplate="footer">
          <button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
          <button pButton pRipple label="Save" icon="pi pi-check" class="p-button-text" (click)="saveUser()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  providers: [MessageService, ConfirmationService, UserService]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  user: User = {} as User;
  selectedUsers: User[] = [];
  userDialog: boolean = false;
  loading: boolean = true;
  
  statuses: any[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' }
  ];
  
  departments: Department[] = [
    { name: 'IT', code: 'IT' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Sales', code: 'SLS' },
    { name: 'Finance', code: 'FIN' },
    { name: 'HR', code: 'HR' },
    { name: 'Operations', code: 'OPS' },
    { name: 'Customer Support', code: 'CS' },
    { name: 'Product', code: 'PRD' },
    { name: 'Engineering', code: 'ENG' }
  ];
  
  availableRoles: any[] = [
    { name: 'ROLE_USER', code: 'USER' },
    { name: 'ROLE_ADMIN', code: 'ADMIN' },
    { name: 'ROLE_MANAGER', code: 'MANAGER' },
    { name: 'ROLE_EDITOR', code: 'EDITOR' }
  ];
  
  selectedRoles: any[] = [];
  activityValues: number[] = [0, 100];
  
  @ViewChild('filter') filter!: ElementRef;
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
        this.loading = false;
      }
    });
  }
  
  openUserDialog() {
    this.user = {} as User;
    this.user.roles = [];
    this.user.status = 'active';
    this.user.verified = false;
    this.user.activity = 0;
    this.selectedRoles = [];
    this.userDialog = true;
  }
  
  editUser(user: User) {
    this.user = { ...user };
    this.selectedRoles = this.availableRoles.filter(role => user.roles.includes(role.name));
    this.userDialog = true;
  }
  
  hideDialog() {
    this.userDialog = false;
  }
  
  saveUser() {
    if (!this.user.username || !this.user.email) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
      return;
    }
    
    if (this.user.id) {
      // Update existing user
      this.userService.updateUser(this.user).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated', life: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000 });
        }
      });
    } else {
      // Create new user
      this.userService.createUser(this.user).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created', life: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user', life: 3000 });
        }
      });
    }
    
    this.userDialog = false;
  }
  
  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.username}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user);
      }
    });
  }
  
  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted', life: 3000 });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 });
      }
    });
  }
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  
  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warn';
      default:
        return 'info';
    }
  }
  
  onRoleChange(event: any) {
    this.user.roles = this.selectedRoles.map(role => role.name);
  }
}