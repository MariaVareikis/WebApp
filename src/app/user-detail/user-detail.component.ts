import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserDetailComponent implements OnInit {
  @Input() user!: User; // Input for user data
  @Output() userUpdated = new EventEmitter<User>(); // Emit updated user
  @Output() userDeleted = new EventEmitter<string>(); // Emit user ID for deletion
  @Output() closeModal = new EventEmitter<void>(); // Emit to close modal

  updateForm!: FormGroup; // Form group for updating user
  isEditing = false; // Flag to toggle edit mode

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    // Initialize form with user data and validation rules
    this.updateForm = this.fb.group({
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [
        this.user.password,
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  onEdit(): void {
    this.isEditing = true; // Enable editing mode
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      // Update user and emit updated user
      this.userService
        .updateUser(this.user.id, this.updateForm.value)
        .subscribe({
          next: (updatedUser) => {
            this.userUpdated.emit(updatedUser); // Emit updated user data
            this.closeModal.emit(); // Close modal
          },
          error: (error) => {
            console.error('Error updating user:', error); // Log error
          },
        });
    }
  }

  onDelete(): void {
    if (this.user) {
      this.userDeleted.emit(this.user.id); // Emit user ID for deletion
    }
  }

  onCloseModal(): void {
    this.closeModal.emit(); // Close modal
  }
}
