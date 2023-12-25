import { differenceInSeconds } from 'date-fns';
import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import { cyclesActions } from '@/reducers/cycles/actions';
import {
  cyclesReducer,
  type Cycle,
  type CyclesState,
} from '@/reducers/cycles/reducer';

type CreateCycleData = {
  task: string;
  minutesAmount: number;
};

type CyclesContextData = {
  activeCycle: Cycle | null;
  activeCycleId: string | null;
  cycles: Cycle[];
  elapsedSeconds: number;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
};

type CyclesContextProviderProps = {
  children: ReactNode;
};

export const CyclesContext = createContext<CyclesContextData | null>(null);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      activeCycleId: null,
      cycles: [],
    },
    (initialState) => {
      const storedStateJSON = localStorage.getItem(
        '@pomodoro-timer:cycles-state-1.0.0',
      );

      if (storedStateJSON) {
        return JSON.parse(storedStateJSON) as CyclesState;
      }

      return initialState;
    },
  );

  const { activeCycleId, cycles } = cyclesState;

  const activeCycle =
    cycles.find((cycle) => cycle.id === activeCycleId) ?? null;

  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle = {
      id,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
      task: data.task,
    } satisfies Cycle;

    dispatch(cyclesActions.addNewCycleAction(newCycle));
    setElapsedSeconds(0);
  }

  function interruptCurrentCycle() {
    dispatch(cyclesActions.interruptCurrentCycleAction());
    setElapsedSeconds(0);
  }

  function markCurrentCycleAsFinished() {
    dispatch(cyclesActions.markCurrentCycleAsFinishedAction());
  }

  function setSecondsPassed(seconds: number) {
    setElapsedSeconds(seconds);
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem('@pomodoro-timer:cycles-state-1.0.0', stateJSON);
  }, [cyclesState]);

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        cycles,
        elapsedSeconds,
        createNewCycle,
        interruptCurrentCycle,
        markCurrentCycleAsFinished,
        setSecondsPassed,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
