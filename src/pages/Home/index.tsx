import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';
import { HandPalm, Play } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles';

const newCycleFormSchema = z.object({
  task: z.string().min(1, 'Informe a tarefa'),
  minutesAmount: z.coerce
    .number()
    .min(5, 'O ciclo deve ter no mínimo 5 minutos')
    .max(60, 'O ciclo deve ter no máximo 60 minutos'),
});

type NewCycleFormData = z.infer<typeof newCycleFormSchema>;

type Cycle = {
  id: string;
  finishedDate?: Date;
  interruptedDate?: Date;
  minutesAmount: number;
  startDate: Date;
  task: string;
};

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { handleSubmit, register, reset, watch } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      minutesAmount: 30,
    },
  });

  const task = watch('task');
  const isSubmitDisabled = !task;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - elapsedSeconds : 0;

  const currentMinutesAmount = Math.floor(currentSeconds / 60);
  const currentSecondsAmount = currentSeconds % 60;

  const minutes = String(currentMinutesAmount).padStart(2, '0');
  const seconds = String(currentSecondsAmount).padStart(2, '0');

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

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = window.setInterval(() => {
        const elapsedSecondsSinceStart = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        );

        if (elapsedSecondsSinceStart >= totalSeconds) {
          setCycles((prevCycles) =>
            prevCycles.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              }
              return cycle;
            }),
          );

          setElapsedSeconds(totalSeconds);

          window.clearInterval(interval);
        } else {
          setElapsedSeconds(elapsedSecondsSinceStart);
        }
      }, 1000);
    }

    return () => window.clearInterval(interval);
  }, [activeCycle, activeCycleId, totalSeconds]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} ${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>

          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>

          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount')}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
