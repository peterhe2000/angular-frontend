import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { State } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { EventObject } from 'xstate';
import { User } from '../../../shared';
import { createStateMachine } from '../../../shared/services/create-machine';
import { userListMachine } from './user-list.machine';
import { UserListStore } from './user-list.store';
import { takeUntil, tap } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'ss-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserListStore],
})
export class UserListComponent implements OnInit, OnDestroy {
  @Input() set usersLoading(value: boolean) {
    //this.userListEvents$.next({ type: 'TOGGLE' });
    this.userListStore.setUsersLoading(value);
  }
  @Input() set users(value: User[]) {
    this.userListStore.setUsers(value);
  }
  @Output() deleteUser = new EventEmitter<{ userId: number }>();
  @Output() nameChange = new EventEmitter<{ user: User; userId: number }>();
  @Output() optionChange = new EventEmitter<{ isOdd: boolean }>();

  readonly vm$ = this.userListStore.vm$.pipe(
    tap(({ usersLoading, filterText, currentXState }) => {
      console.log('this.vm$.pipe usersLoading', usersLoading);
      console.log('this.vm$.pipe filterText', filterText);
      console.log('this.vm$.pipe currentXState', currentXState);
      this.doSomethingDependsOnState(currentXState);
    })
  );

  filterTextFormGroup: FormGroup;
  userListEvents$ = new Subject<EventObject>();
  state$: Observable<any>;

  private _destroyed$ = new Subject<void>();

  constructor(
    private readonly userListStore: UserListStore,
    private readonly formBuilder: FormBuilder
  ) {
    this._buildFilterTextFormGroup();
  }

  ngOnInit(): void {
    this.state$ = createStateMachine(userListMachine, {
      id: 'user-list State',
      services: {},
      context: {},
      devTools: true,
      events: [this.userListEvents$],
    });

    this.state$.pipe(takeUntil(this._destroyed$)).subscribe((state) => {
      this.userListStore.setCurrentXState(state);
    });
  }

  doSomethingDependsOnState(state: any) {
    console.log('doSomethingDependsOnState state.value', state.value);
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  onDeleteButtonClick(userId: number) {
    this.deleteUser.emit({ userId });
  }

  onNameChange(name: string, userId: number) {
    const user: User = { id: userId, name: name };
    this.nameChange.emit({ user: user, userId: userId });
  }

  onOptionChange({ value }) {
    console.log('onOptionChange', value);
    this.userListEvents$.next({ type: 'TOGGLE' });
    const isOdd = value === 'odd';
    this.userListStore.setSelectedOption(value);
    this.optionChange.emit({ isOdd });
  }

  onFilterTextChange(filterText: string) {
    console.log('filterText', filterText);
    this.userListStore.setFilterText(filterText);
  }

  private _buildFilterTextFormGroup() {
    this.filterTextFormGroup = this.formBuilder.group({
      filterText: new FormControl(null, [Validators.required]),
    });
  }
}

// TODO:
// 0. API project, run concurrently
// 1. output
// 2. test
// 5. Try data => Normalzer => entity Adapter and entity Adapter => Normalzer => data
