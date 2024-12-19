import { Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
// import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';

export const routes: Routes = [
    // Route for listing all users
    { path: '', component: UsersListComponent },

    // Route for displaying user details
    // { path: 'users/:id', component: UserDetailComponent },

    // Route for adding a new user
    { path: 'users/new', component: UserFormComponent },

    // Route for editing an existing user
    { path: 'users/edit/:id', component: UserFormComponent },

    // Redirect to the users list as default route (optional)
    { path: '', redirectTo: '/users', pathMatch: 'full' },
];
