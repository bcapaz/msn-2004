import React, { useState } from 'react';

export default function ChatWindow({ activeContact, messages, onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f9ff]">
      <div className="bg-gradient-to-r from-[#235d81] to-[#86b9e0] p-2 text-white flex justify-between items-center">
        <span className="text-sm font-bold">Conversando com: {activeContact?.display_name || activeContact?.username}</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white m-2 border border-gray-300 rounded shadow-inner">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 text-sm leading-snug">
            <span className={`font-bold ${msg.isMe ? 'text-blue-700' : 'text-[#e47911]'}`}>
              {msg.senderName} diz:
            </span>
            <p className="ml-2 text-gray-800 break-words">{msg.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-2 flex gap-2 items-end bg-[#d9e8f5]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-400 p-2 text-sm h-16 resize-none outline-none bg-white focus:border-blue-500"
          placeholder="Digite sua mensagem..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button type="submit" className="msn-button h-16 px-6 font-bold uppercase text-xs">Enviar</button>
      </form>
    </div>
  );
}
