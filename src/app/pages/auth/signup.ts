import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, RippleModule, CheckboxModule, ToastModule, AppFloatingConfigurator],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast></p-toast>
        <div class="login-background">
            <div class=" flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
                <div class="flex flex-col items-center justify-center">
                    <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                        <div class="w-full bg-surface-0 dark:bg-surface-900 py-16 px-8 sm:px-20" style="border-radius: 53px">
                            <div class="text-center mb-6">
                                <div class="flex justify-center pb-8">
                                    <img class="img-responsive" src="assets/img/logo (1).png" width="150" height="auto" />
                                </div>
                                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create your account</div>
                                <span class="text-muted-color font-medium">Sign up to get started</span>
                            </div>

                            <div>
                                <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input pInputText id="username" type="text" placeholder="Username (3-20 characters)" class="w-full md:w-[30rem] mb-4" [(ngModel)]="signupRequest.username" [ngClass]="{ 'ng-invalid ng-dirty': usernameError }" />
                                <small *ngIf="usernameError" class="p-error block mb-4">{{ usernameError }}</small>

                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input pInputText id="email" type="email" placeholder="Email address" class="w-full md:w-[30rem] mb-4" [(ngModel)]="signupRequest.email" [ngClass]="{ 'ng-invalid ng-dirty': emailError }" />
                                <small *ngIf="emailError" class="p-error block mb-4">{{ emailError }}</small>

                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password
                                    id="password"
                                    [(ngModel)]="signupRequest.password"
                                    placeholder="Password (6-40 characters)"
                                    [toggleMask]="true"
                                    styleClass="mb-4"
                                    [feedback]="true"
                                    [fluid]="true"
                                    [ngClass]="{ 'ng-invalid ng-dirty': passwordError }"
                                ></p-password>
                                <small *ngIf="passwordError" class="p-error block mb-4">{{ passwordError }}</small>

                                <div class="flex items-center mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <p-checkbox [(ngModel)]="termsAccepted" id="terms" binary class="mr-2"></p-checkbox>
                                        <label for="terms">I agree to the <a href="#" class="text-primary">Terms of Service</a> and <a href="#" class="text-primary">Privacy Policy</a></label>
                                    </div>
                                </div>
                                <p-button label="Sign Up" styleClass="w-full" (onClick)="onSignup()" [loading]="loading"></p-button>

                                <div class="text-center mt-6">Already have an account? <a routerLink="/auth/login" class="text-primary font-medium">Sign In</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Signup implements OnInit {
    signupRequest = {
        username: '',
        email: '',
        password: '',
        role: ['user'] as string[]
    };

    termsAccepted: boolean = false;
    loading: boolean = false;

    // Validation errors
    usernameError: string = '';
    emailError: string = '';
    passwordError: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // Redirect to home if already logged in
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
        }
    }

    validateForm(): boolean {
        let isValid = true;

        // Reset errors
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';

        // Validate username
        if (!this.signupRequest.username) {
            this.usernameError = 'Username is required';
            isValid = false;
        } else if (this.signupRequest.username.length < 3 || this.signupRequest.username.length > 20) {
            this.usernameError = 'Username must be between 3 and 20 characters';
            isValid = false;
        }

        // Validate email
        if (!this.signupRequest.email) {
            this.emailError = 'Email is required';
            isValid = false;
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(this.signupRequest.email)) {
                this.emailError = 'Please enter a valid email address';
                isValid = false;
            }
        }

        // Validate password
        if (!this.signupRequest.password) {
            this.passwordError = 'Password is required';
            isValid = false;
        } else if (this.signupRequest.password.length < 6 || this.signupRequest.password.length > 40) {
            this.passwordError = 'Password must be between 6 and 40 characters';
            isValid = false;
        }

        // Validate terms
        if (!this.termsAccepted) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'You must accept the Terms of Service and Privacy Policy'
            });
            isValid = false;
        }

        return isValid;
    }

    onSignup(): void {
        if (!this.validateForm()) {
            return;
        }

        this.loading = true;

        this.authService
            .register(this.signupRequest)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Registration successful! Please sign in.'
                    });

                    // Navigate to login page after successful registration
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 2000);
                },
                error: (error) => {
                    if (error.error?.message) {
                        if (error.error.message.includes('Username')) {
                            this.usernameError = error.error.message;
                        } else if (error.error.message.includes('Email')) {
                            this.emailError = error.error.message;
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error.message || 'Registration failed. Please try again.'
                            });
                        }
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Registration failed. Please try again.'
                        });
                    }
                }
            });
    }
}
