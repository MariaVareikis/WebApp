import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid to generate unique IDs
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules
})
export class UserFormComponent implements OnInit {
  @Output() userAdded = new EventEmitter<User>(); // Event to emit added user
  @Output() closeModal = new EventEmitter<void>(); // Event to close modal

  addForm!: FormGroup; // Form group for adding a user

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    // Initialize form with validation
    this.addForm = this.fb.group({
      name: ['', [Validators.required]], // Name is required
      email: ['', [Validators.required, Validators.email]], // Email is required and should be a valid email
      password: ['', [Validators.required, Validators.minLength(6)]], // Password is required and should be at least 6 characters
    });
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      // If form is valid, create new user and emit the event
      const newUser: User = {
        id: uuidv4(), // Generate a unique ID for the new user
        ...this.addForm.value, // Spread the form values into the user object
      };
      this.userAdded.emit(newUser); // Emit the newly added user
      this.userService.addUser(newUser).subscribe(); // Call service to add user to the backend
    }
  }

  onCloseModal(): void {
    // Close the modal
    this.closeModal.emit();
  }
}
