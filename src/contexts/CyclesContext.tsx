import { createContext, useState, type ReactNode } from 'react';

type Cycle = {
  id: string;
  finishedDate?: Date;
  interruptedDate?: Date;
  minutesAmount: number;
  startDate: Date;
  task: string;
};

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
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeCycle =
    cycles.find((cycle) => cycle.id === activeCycleId) ?? null;

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle = {
      id,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
      task: data.task,
    } satisfies Cycle;

    setCycles((prevCycles) => [...prevCycles, newCycle]);
    setActiveCycleId(id);
    setElapsedSeconds(0);
  }

  function interruptCurrentCycle() {
    setCycles((prevCycles) =>
      prevCycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        }
        return cycle;
      }),
    );

    setActiveCycleId(null);
    setElapsedSeconds(0);
  }

  function markCurrentCycleAsFinished() {
    setCycles((prevCycles) =>
      prevCycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        }
        return cycle;
      }),
    );
  }

  function setSecondsPassed(seconds: number) {
    setElapsedSeconds(seconds);
  }

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
