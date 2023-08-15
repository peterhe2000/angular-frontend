import {
  EventObject,
  StateMachine,
  InterpreterOptions,
  MachineOptions,
  StateConfig,
  interpret,
} from 'xstate';
import { from, BehaviorSubject, Observable, merge } from 'rxjs';
import { filter, startWith, shareReplay, finalize, tap } from 'rxjs/operators';

interface CreateStateMachineOptions<TContext, TEvent extends EventObject> {
  /**
   * If provided, will be merged with machine's `context`.
   */
  context?: Partial<TContext>;
  /**
   * The state to rehydrate the machine to. The machine will
   * start at this state instead of its `initialState`.
   */
  state?: StateConfig<TContext, TEvent>;

  /**
   * Events to send to the service
   * E.g. user events, or can also be NgRx actions/selectors
   */
  events?: Observable<TEvent>[];
}

const createStateMachineDefaultOptions = {
  events: [],
};

export function createStateMachine<TContext, TEvent extends EventObject>(
  machine: StateMachine<TContext, any, TEvent>,
  options: Partial<InterpreterOptions> &
    Partial<CreateStateMachineOptions<TContext, TEvent>> &
    Partial<MachineOptions<TContext, TEvent>> = createStateMachineDefaultOptions
) {
  const {
    context,
    guards,
    actions,
    activities,
    services,
    delays,
    state: rehydratedState,
    events,
    ...interpreterOptions
  } = options;

  const machineConfig = {
    context,
    guards,
    actions,
    activities,
    services,
    delays,
  };

  const machineConfigured = machine.withConfig(machineConfig, {
    ...machine.context,
    ...context,
  });

  const service = interpret(machineConfigured, interpreterOptions).start();
  const input = merge(...events)
    .pipe(
      tap(() => {
        console.log('input changed');
      })
    )
    .subscribe(service.send);
  const state$ = from(service).pipe(
    tap(() => {
      console.log('state$ changed');
    }),
    filter((p) => p.changed),
    startWith(service.state),
    shareReplay(1),
    finalize(() => {
      console.log('finalize$ changed');
      service.stop();
      input.unsubscribe();
    })
  );

  return state$;
}
