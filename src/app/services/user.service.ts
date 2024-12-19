import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  private usersUrl = `${environment.usersUrl}`;

  constructor(private http: HttpClient) {
    // Load users from localStorage or set to empty array
    const storedUsers = localStorage.getItem('users');
    this.usersSubject.next(storedUsers ? JSON.parse(storedUsers) : []);
  }

  // Load users from localStorage or mock JSON file
  loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.usersSubject.next(JSON.parse(storedUsers));
    } else {
      this.http
        .get<User[]>(this.usersUrl)
        .pipe(
          tap((users) => {
            this.usersSubject.next(users);
            localStorage.setItem('users', JSON.stringify(users));
          }),
          catchError(() => of([])) // Return empty array on error
        )
        .subscribe();
    }
  }

  // Add new user with unique ID
  addUser(user: User): Observable<User> {
    const newUser = { id: uuidv4(), ...user };
    const users = [...this.usersSubject.getValue(), newUser];
    this.usersSubject.next(users);
    localStorage.setItem('users', JSON.stringify(users));
    return of(newUser); // Emit newly added user
  }

  // Update an existing user's data
  updateUser(id: string, updatedUser: Partial<User>): Observable<User> {
    const users = this.usersSubject.getValue();
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.usersSubject.next(users);
      localStorage.setItem('users', JSON.stringify(users));
      return of(users[index]);
    }
    return new Observable((observer) => observer.error('User not found'));
  }

  // Delete a user by ID
  deleteUser(userId: string): Observable<void> {
    const users = this.usersSubject
      .getValue()
      .filter((user) => user.id !== userId);
    this.usersSubject.next(users);
    localStorage.setItem('users', JSON.stringify(users));
    return of(undefined); // Complete deletion
  }

  // Get a user by ID
  getUserById(id: string): Observable<User | undefined> {
    const user = this.usersSubject.getValue().find((user) => user.id === id);
    return user
      ? of(user)
      : new Observable((observer) => observer.error('User not found'));
  }
}
