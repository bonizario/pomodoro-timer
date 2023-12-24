import { zodResolver } from '@hookform/resolvers/zod';
import { HandPalm, Play } from 'phosphor-react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';

type Cycle = {
  id: string;
  finishedDate?: Date;
  interruptedDate?: Date;
  minutesAmount: number;
  startDate: Date;
  task: string;
};

type CyclesContextData = {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  elapsedSeconds: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
};

export const CyclesContext = createContext({} as CyclesContextData);

const newCycleFormSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: z.coerce
    .number()
    .min(5, 'O ciclo deve ter no mínimo 5 minutos')
    .max(60, 'O ciclo deve ter no máximo 60 minutos'),
});

type NewCycleFormData = z.infer<typeof newCycleFormSchema>;

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      minutesAmount: 30,
    },
  });

  const { handleSubmit, reset, watch } = newCycleForm;

  const task = watch('task');
  const isSubmitDisabled = !task;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setElapsedSeconds(seconds);
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

  function handleCreateNewCycle(data: NewCycleFormData) {
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

  function handleInterruptCycle() {
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

    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            elapsedSeconds,
            markCurrentCycleAsFinished,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
