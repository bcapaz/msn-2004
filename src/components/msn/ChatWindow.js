import React, { useState, useEffect } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);

  // Busca as mensagens quando o contato muda
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };
    fetchMessages();
  }, [activeContact, currentUser]);

  return (
    <div className="flex flex-col h-full bg-[#f3f9ff]">
      
      {/* Barra de Título do Chat */}
      <div className="bg-gradient-to-r from-[#235d81] to-[#86b9e0] p-2 text-white flex justify-between items-center shadow-md">
        <span className="text-sm font-bold flex items-center gap-2">
          <img src={activeContact.avatar_url} className="w-5 h-5 object-contain" />
          Conversando com: {activeContact?.display_name || activeContact?.username}
        </span>
      </div>

      {/* Histórico de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto bg-white m-2 border border-gray-300 rounded shadow-inner custom-scrollbar">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-xs italic mt-10">
            Esta é uma nova conversa. Nenhum acordo ou traição diplomática registrada ainda.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 text-sm leading-snug">
            <span className={`font-bold ${msg.senderId === currentUser.id ? 'text-blue-700' : 'text-[#e47911]'}`}>
              {msg.sender.display_name || msg.sender.username} diz:
            </span>
            <p className="ml-2 text-gray-800 break-words">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Área de Input (Só visual por enquanto) */}
      <div className="p-2 flex gap-2 items-end bg-[#d9e8f5]">
        <textarea
          disabled
          className="flex-1 border border-gray-400 p-2 text-sm h-16 resize-none outline-none bg-gray-100 placeholder:text-gray-400"
          placeholder="Envio de mensagens será ativado no próximo passo..."
        />
        <button disabled className="msn-button h-16 px-6 font-bold uppercase text-xs opacity-50 cursor-not-allowed">Enviar</button>
      </div>
    </div>
  );
}
