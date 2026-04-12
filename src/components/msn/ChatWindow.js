import React, { useState } from 'react';

export default function ChatWindow({ activeContact, messages, onSendMessage, onSendNudge }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full border border-gray-400 bg-[#f3f9ff] shadow-lg rounded-t-lg">
      {/* Header da Janela */}
      <div className="bg-gradient-to-r from-[#235d81] to-[#86b9e0] p-2 text-white flex justify-between items-center rounded-t-md">
        <span className="text-sm font-bold truncate">Para: {activeContact?.display_name}</span>
        <div className="flex gap-1 text-xs"> _ ⬜ X </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto bg-white m-2 border border-gray-300 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 text-sm">
            <span className={`font-bold ${msg.isMe ? 'text-blue-700' : 'text-orange-600'}`}>
              {msg.senderName} diz:
            </span>
            <p className="ml-2 text-gray-800">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Barra de Ferramentas (Emoticons, Nudge) */}
      <div className="px-2 flex gap-2">
        <button 
          onClick={onSendNudge}
          className="hover:bg-gray-200 p-1 rounded transition"
          title="Chamar a atenção"
        >
          <img src="/images/nudge-icon.png" className="w-5 h-5" alt="Nudge" />
        </button>
      </div>

      {/* Input de Texto */}
      <form onSubmit={handleSubmit} className="p-2 flex gap-2 items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-400 p-1 text-sm h-12 resize-none outline-none focus:border-blue-500"
          placeholder="Escreva sua mensagem aqui..."
        />
        <button type="submit" className="msn-button h-12 px-4 font-bold">Enviar</button>
      </form>
    </div>
  );
}
