import { produce } from 'immer';

export type Cycle = {
  id: string;
  finishedDate?: Date;
  interruptedDate?: Date;
  minutesAmount: number;
  startDate: Date;
  task: string;
};

export type CyclesState = {
  cycles: Cycle[];
  activeCycleId: string | null;
};

export type Action =
  | {
      type: 'ADD_NEW_CYCLE';
      payload: {
        newCycle: Cycle;
      };
    }
  | {
      type: 'INTERRUPT_CURRENT_CYCLE' | 'MARK_CURRENT_CYCLE_AS_FINISHED';
    };

export function cyclesReducer(state: CyclesState, action: Action) {
  switch (action.type) {
    case 'ADD_NEW_CYCLE': {
      return produce(state, (draft) => {
        draft.activeCycleId = action.payload.newCycle.id;
        draft.cycles.unshift(action.payload.newCycle);
      });
    }
    case 'INTERRUPT_CURRENT_CYCLE': {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      );

      if (currentCycleIndex === -1) {
        return state;
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].interruptedDate = new Date();
      });
    }
    case 'MARK_CURRENT_CYCLE_AS_FINISHED': {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      );

      if (currentCycleIndex === -1) {
        return state;
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].finishedDate = new Date();
      });
    }
    default:
      return state;
  }
}
