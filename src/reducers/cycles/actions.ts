import type { Action, Cycle } from './reducer';

export const cyclesActions = {
  addNewCycleAction: (newCycle: Cycle): Action => ({
    type: 'ADD_NEW_CYCLE',
    payload: {
      newCycle,
    },
  }),
  interruptCurrentCycleAction: (): Action => ({
    type: 'INTERRUPT_CURRENT_CYCLE',
  }),
  markCurrentCycleAsFinishedAction: (): Action => ({
    type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
  }),
};
