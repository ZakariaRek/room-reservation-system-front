import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast></p-toast>
        <div class="login-background">
            <div class="flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
                <div class="flex flex-col items-center justify-center">
                    <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                            <div class="text-center mb-6">
                                <div class="flex justify-center pb-8">
                                    <img class="img-responsive" src="assets/img/logo (1).png" width="150" height="auto" />
                                </div>
                                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome back!</div>
                                <span class="text-muted-color font-medium">Sign in to continue</span>
                            </div>

                            <div>
                                <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input pInputText id="username" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-4" [(ngModel)]="username" [ngClass]="{ 'ng-invalid ng-dirty': usernameError }" />
                                <small *ngIf="usernameError" class="p-error block mb-4">{{ usernameError }}</small>

                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password id="password" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" [ngClass]="{ 'ng-invalid ng-dirty': passwordError }"></p-password>
                                <small *ngIf="passwordError" class="p-error block mb-4">{{ passwordError }}</small>

                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <p-checkbox [(ngModel)]="rememberMe" id="rememberme" binary class="mr-2"></p-checkbox>
                                        <label for="rememberme">Remember me</label>
                                    </div>
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                                </div>
                                <p-button label="Sign In" styleClass="w-full" (onClick)="onLogin()" [loading]="loading"></p-button>

                                <div *ngIf="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</div>

                                <div class="text-center mt-6">Don't have an account? <a routerLink="/auth/signup" class="text-primary font-medium">Sign Up</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {
    username: string = '';
    password: string = '';
    rememberMe: boolean = false;
    loading: boolean = false;
    errorMessage: string = '';
    returnUrl: string = '/';

    // Validation errors
    usernameError: string = '';
    passwordError: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // Get return URL from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // Redirect to home if already logged in
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
        }
    }

    validateForm(): boolean {
        let isValid = true;

        // Reset errors
        this.usernameError = '';
        this.passwordError = '';

        // Validate username
        if (!this.username) {
            this.usernameError = 'Username is required';
            isValid = false;
        }

        // Validate password
        if (!this.password) {
            this.passwordError = 'Password is required';
            isValid = false;
        }

        return isValid;
    }

    onLogin(): void {
        if (!this.validateForm()) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.authService
            .login(this.username, this.password)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Login successful!'
                    });

                    // Navigate to return url
                    setTimeout(() => {
                        this.router.navigate([this.returnUrl]);
                    }, 1000);
                },
                error: (error) => {
                    if (error.error?.message) {
                        this.errorMessage = error.error.message;
                    } else {
                        this.errorMessage = 'Login failed. Please check your credentials.';
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: this.errorMessage
                    });
                }
            });
    }
}
