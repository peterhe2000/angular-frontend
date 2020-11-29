import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { User } from '@ss/app1/user';
import { tap } from 'rxjs/operators';

export interface UserListState {
  usersLoading: boolean;
  users: User[];
  selectedOption: string;
  filterText: string;
  options: string[];
  currentXState: any;
}

@Injectable()
export class UserListStore extends ComponentStore<UserListState> {
  constructor() {
    super({
      usersLoading: true,
      users: null,
      selectedOption: null,
      filterText: null,
      options: ['odd', 'even'],
      currentXState: null,
    });
  }

  // *********** Updaters *********** //

  readonly setUsersLoading = this.updater((state, value: boolean) => {
    console.log('setUsersLoading');
    return {
      ...state,
      usersLoading: value,
    };
  });

  readonly setUsers = this.updater((state, value: User[]) => {
    console.log('setUsers');
    return {
      ...state,
      users: value,
    };
  });

  readonly setSelectedOption = this.updater((state, value: string) => {
    console.log('setSelectedOption');
    return {
      ...state,
      selectedOption: value,
    };
  });

  readonly setFilterText = this.updater((state, value: string) => {
    console.log('setFilterText');
    return {
      ...state,
      filterText: value,
    };
  });

  readonly setCurrentXState = this.updater((state, value: boolean) => {
    console.log('setCurrentXState');
    return {
      ...state,
      currentXState: value,
    };
  });
  // *********** Selectors *********** //

  // ViewModel
  readonly vm$ = this.select(this.state$, (state) => {
    console.log('vm$ state', state);
    return {
      usersLoading: state.usersLoading,
      users: state.users,
      selectedOption: state.selectedOption,
      filterText: state.filterText,
      options: state.options,
      currentXState: state.currentXState,
    };
  });

  // *********** Effects *********** //
}
