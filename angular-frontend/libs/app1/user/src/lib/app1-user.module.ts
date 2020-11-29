import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app1-user-routing.module';
import { UserContainerComponent } from './user/container/user-container.component';
import { UserService } from './shared/services/userService.service';
import { UserModule } from './shared/data-access/user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { NameFilterPipe } from './pipes/name-filter.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AddUserComponent } from './user/components/add-user/add-user.component';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { PaginatorComponent } from './user/components/paginator/paginator.component';
@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    UserModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    UserContainerComponent,
    NameFilterPipe,
    UserListComponent,
    AddUserComponent,
    PaginatorComponent,
  ],
  providers: [UserService],
})
export class App1UserModule {}
