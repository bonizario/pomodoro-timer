import { differenceInSeconds } from 'date-fns';
import { useContext, useEffect } from 'react';

import { CyclesContext } from '@/pages/Home';
import { CountdownContainer, Separator } from './styles';

export function Countdown() {
  const {
    activeCycle,
    elapsedSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  const currentSeconds = activeCycle ? totalSeconds - elapsedSeconds : 0;

  const currentMinutesAmount = Math.floor(currentSeconds / 60);
  const currentSecondsAmount = currentSeconds % 60;

  const minutes = String(currentMinutesAmount).padStart(2, '0');
  const seconds = String(currentSecondsAmount).padStart(2, '0');

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = window.setInterval(() => {
        const elapsedSecondsSinceStart = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        );

        if (elapsedSecondsSinceStart >= totalSeconds) {
          markCurrentCycleAsFinished();

          setSecondsPassed(totalSeconds);

          window.clearInterval(interval);
        } else {
          setSecondsPassed(elapsedSecondsSinceStart);
        }
      }, 1000);
    }

    return () => window.clearInterval(interval);
  }, [activeCycle, markCurrentCycleAsFinished, setSecondsPassed, totalSeconds]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} ${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
