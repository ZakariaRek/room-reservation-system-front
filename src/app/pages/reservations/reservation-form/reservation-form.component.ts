import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ReservationService, Reservation } from '../../../services/reservation1.service';
import { Panel } from 'primeng/panel';

@Component({
    standalone: true,
    selector: 'app-reservation-form',
    templateUrl: './reservation-form.component.html',
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule, Panel]
})
export class ReservationFormComponent implements OnInit {
    form!: FormGroup;
    reservationId?: number;

    statuses = [
        { label: 'PENDING', value: 'PENDING' },
        { label: 'CONFIRMED', value: 'CONFIRMED' },
        { label: 'CANCELLED', value: 'CANCELLED' }
    ];

    constructor(
        private fb: FormBuilder,
        private reservationService: ReservationService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            date: ['', Validators.required],
            time: ['', Validators.required],
            status: ['', Validators.required],
            roomId: [null, Validators.required],
            userId: [null, Validators.required]
        });

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.reservationId = +idParam;
            this.reservationService.getReservation(this.reservationId).subscribe((res) => {
                this.form.patchValue(res);
            });
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        if (this.reservationId) {
            // Mode édition
            const reservation: Reservation = this.form.value;
            this.reservationService.updateReservation(this.reservationId, reservation).subscribe(() => {
                this.router.navigate(['/reservations']);
            });
        } else {
            // Mode création
            const { date, time, roomId, userId } = this.form.value;
            const reservation = { date, time, roomId, userId };
            console.log('Envoi de la réservation:', reservation);

            this.reservationService.createReservation(reservation).subscribe({
                next: (res) => {
                    console.log('Réponse du backend:', res);
                    this.router.navigate(['/reservations']);
                },
                error: (err) => {
                    console.error('Erreur lors de la création:', err);
                    alert('Erreur lors de la création: ' + err.error?.message || 'Inconnue');
                }
            });
        }
    }
}
