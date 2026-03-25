import { useEffect, useMemo } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Content } from '../layout/Content';
import { OpenClawClient } from '../services/openclaw';
import { useAppStore } from '../state/store';

export function App() {
  const setWsStatus = useAppStore((s) => s.setWsStatus);
  const addMessage = useAppStore((s) => s.addMessage);

  const client = useMemo(
    () =>
      new OpenClawClient('ws://localhost:18789', {
        onStatus: setWsStatus,
        onError: console.error,
        onMessage: ({ text }) => {
          addMessage({
            id: crypto.randomUUID(),
            threadId: 'main',
            role: 'assistant',
            text,
            createdAt: new Date().toISOString(),
          });
        },
      }),
    [setWsStatus, addMessage],
  );

  useEffect(() => {
    client.connect();
    return () => client.disconnect();
  }, [client]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <Content />
    </div>
  );
}
