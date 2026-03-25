import { useState } from 'react';
import { useAppStore } from '../../state/store';

export function ChatPage() {
  const [text, setText] = useState('');
  const messages = useAppStore((s) => s.messages);

  return (
    <section>
      <h1>Chat</h1>
      <div>
        {messages.map((m) => (
          <p key={m.id}>
            <strong>{m.role}:</strong> {m.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setText('');
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Напишите сообщение" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
