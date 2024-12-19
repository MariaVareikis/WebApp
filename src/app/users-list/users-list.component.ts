import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent, UserDetailComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  // BehaviorSubject to manage and emit the list of users
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable(); // Observable to be subscribed to in the template

  showAddUserModalFlag = false; // Flag to control the display of 'Add User' modal
  showUpdateUserModalFlag = false; // Flag to control the display of 'Update User' modal
  selectedUser: User | null = null; // Holds the selected user for updating or deleting

  constructor(private userService: UserService) {
    // Assigning the observable of users from the user service
    this.users$ = this.userService.users$;
  }

  // Show the 'Add User' modal
  showAddUserModal() {
    this.showAddUserModalFlag = true;
  }

  // Close the 'Add User' modal
  closeAddUserModal() {
    this.showAddUserModalFlag = false;
  }

  // Handles the addition of a new user
  onUserAdded(user: User) {
    const currentUsers = this.usersSubject.getValue(); // Get current users
    this.usersSubject.next([...currentUsers, user]); // Update the users list with the new user
    this.closeAddUserModal(); // Close the modal
  }

  // Show the 'Update User' modal when a user card is clicked
  onCardClick(user: User) {
    this.selectedUser = user; // Set the selected user for editing
    this.showUpdateUserModalFlag = true; // Show the update modal
  }

  // Handles the update of a user
  onUserUpdated(updatedUser: User) {
    const currentUsers = this.usersSubject.getValue(); // Get current users
    const updatedUsers = currentUsers.map(
      (user) => (user.id === updatedUser.id ? updatedUser : user) // Update the specific user
    );
    this.usersSubject.next(updatedUsers); // Update the users list
    this.showUpdateUserModalFlag = false; // Close the update modal
    this.selectedUser = null; // Reset selected user
  }

  // Handles the deletion of a user
  onUserDeleted(userId: string) {
    Swal.fire({
      title: 'Are you sure?', // Display confirmation modal
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'swal2-popup-above-modal', // Custom styling for Swal
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        this.userService.deleteUser(userId).subscribe(() => {
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            icon: 'success',
            customClass: {
              popup: 'swal2-popup-above-modal', // Custom styling for Swal
            },
          });
          this.showUpdateUserModalFlag = false; // Close the update modal
          this.selectedUser = null; // Reset selected user
        });
      }
    });
  }

  // Close the update user modal
  closeUpdateUserModal() {
    this.selectedUser = null; // Reset selected user
    this.showUpdateUserModalFlag = false; // Close the modal
  }
}
