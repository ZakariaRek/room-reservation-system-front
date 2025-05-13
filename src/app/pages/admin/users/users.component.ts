import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
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
        [globalFilterFields]="['id', 'username', 'email']"
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
            <th>ID</th>
            <th>
              <div class="flex justify-between items-center">
                Username
                <p-columnFilter type="text" field="username" display="menu" placeholder="Search by username"></p-columnFilter>
              </div>
            </th>
            <th>
              <div class="flex justify-between items-center">
                Email
                <p-columnFilter type="text" field="email" display="menu" placeholder="Search by email"></p-columnFilter>
              </div>
            </th>
            <th>Actions</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
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
            <td colspan="4" class="text-center">No users found.</td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="loadingbody">
          <tr>
            <td colspan="4" class="text-center">Loading users data. Please wait.</td>
          </tr>
        </ng-template>
      </p-table>
      
      <p-dialog [(visible)]="userDialog" [style]="{width: '500px'}" header="User information" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <div class="text-center mb-8">
            <div>
              <img class="img-responsive" src="assets/img/logo (1).png" width="150" height="auto" />
            </div>
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">User Information</div>
            <span class="text-muted-color font-medium">Manage user details</span>
          </div>
          <div class="field mb-4">
            <label for="username" class="block mb-2 font-medium">Username</label>
            <input type="text" pInputText id="username" [(ngModel)]="user.username" required autofocus class="w-full p-3" />
          </div>
          <div class="field mb-4">
            <label for="email" class="block mb-2 font-medium">Email</label>
            <input type="email" pInputText id="email" [(ngModel)]="user.email" required class="w-full p-3" />
          </div>
          <div class="field mb-4" *ngIf="!user.id">
            <label for="password" class="block mb-2 font-medium">Password</label>
            <input type="password" pInputText id="password" [(ngModel)]="user.password" required class="w-full p-3" />
          </div>
        </ng-template>
        
        <ng-template pTemplate="footer">
          <div class="flex justify-end gap-2">
            <button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
            <button pButton pRipple label="Save" icon="pi pi-check" class="p-button-text" (click)="saveUser()"></button>
          </div>
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
    this.userDialog = true;
  }
  
  editUser(user: User) {
    this.user = { ...user };
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
}