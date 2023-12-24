import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useCycles } from '@/hooks/useCycles';
import { HistoryContainer, HistoryList, Status } from './styles';

export function History() {
  const { cycles } = useCycles();

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Duração</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>
                  {cycle.minutesAmount}
                  {cycle.minutesAmount === 1 ? ' minuto' : ' minutos'}
                </td>
                <td>
                  {formatDistanceToNow(cycle.startDate, {
                    addSuffix: true,
                    includeSeconds: true,
                    locale: ptBR,
                  })}
                </td>
                <td>
                  {cycle.finishedDate && (
                    <Status $statusColor="green">Concluído</Status>
                  )}
                  {cycle.interruptedDate && (
                    <Status $statusColor="red">Interrompido</Status>
                  )}
                  {!cycle.finishedDate && !cycle.interruptedDate && (
                    <Status $statusColor="yellow">Em andamento</Status>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
