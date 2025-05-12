import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, RoomService } from '../../../services/room.service';
import { Equipment } from '../../../models/equipment.model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    standalone: true,
    selector: 'app-room-form',
    templateUrl: './room-form.component.html',
    styleUrls: ['./room-form.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, DropdownModule]
})
export class RoomFormComponent implements OnInit {
    form!: FormGroup;
    roomId?: number;
    roomTypes = [
        { label: 'Salle de réunion', value: 'MEETING' },
        { label: 'Salle de conférence', value: 'CONFERENCE' },
        { label: 'Espace de travail', value: 'WORKSPACE' }
    ];

    constructor(
        private fb: FormBuilder,
        private roomService: RoomService,
        private route: ActivatedRoute,
        protected router: Router
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            capacity: [0, [Validators.required, Validators.min(1)]],
            type: [''],
            createdByUserId: [''],
            equipments: this.fb.array([]) // Liste dynamique des équipements
        });

        this.roomId = +this.route.snapshot.paramMap.get('id')!;
        if (this.roomId) {
            this.roomService.getById(this.roomId).subscribe((room) => {
                this.form.patchValue(room);
                const equipmentsFormArray = this.form.get('equipments') as FormArray;
                room.equipments?.forEach((eq: Equipment) => {
                    equipmentsFormArray.push(this.fb.group({ name: [eq.name, Validators.required] }));
                });
            });
        }
    }

    get equipments(): FormArray {
        return this.form.get('equipments') as FormArray;
    }

    addEquipment(): void {
        this.equipments.push(this.fb.group({ name: ['', Validators.required] }));
    }

    removeEquipment(index: number): void {
        this.equipments.removeAt(index);
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const room: Room = this.form.value;

        if (this.roomId) {
            this.roomService.update(this.roomId, room).subscribe(() => {
                this.router.navigate(['/rooms']);
            });
        } else {
            this.roomService.create(room).subscribe(() => {
                this.router.navigate(['/rooms']);
            });
        }
    }
}
