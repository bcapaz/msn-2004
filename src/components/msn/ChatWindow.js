import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Polling a cada 3s
    return () => clearInterval(interval);
  }, [activeContact.id, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const content = inputText;
    setInputText('');

    await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: currentUser.id,
        receiverId: activeContact.id,
        content: content
      })
    });
    fetchMessages();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      
      {/* Topo do Chat */}
      <div style={{ 
        height: '70px', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '15px',
        background: 'linear-gradient(to bottom, #fff, #d9e8f5)', borderBottom: '1px solid #a5c3d9'
      }}>
        <img src={activeContact.avatar_url || "/images/avatar-red.png"} style={{ width: '45px', height: '45px', border: '1px solid #7192ad', padding: '2px', background: 'white', objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#235d81' }}>{activeContact.display_name}</div>
          <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{activeContact.subnick || "Disponível"}</div>
        </div>
      </div>

      {/* Histórico com Scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: 'white' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: '11px', marginTop: '30px' }}>
            Nenhuma mensagem trocada ainda.
          </div>
        ) : (
          messages.map((msg, i) => {
            // A MÁGICA ACONTECE AQUI:
            // Verifica de quem é a mensagem cruzando o ID do banco com os usuários da tela
            const isMe = msg.senderId === currentUser.id;
            const senderName = isMe ? currentUser.display_name : activeContact.display_name;
            const nameColor = isMe ? '#235d81' : '#d15b00'; // Azul para você, Laranja para o outro

            return (
              <div key={i} style={{ marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ fontWeight: 'bold', color: nameColor }}>
                  {senderName} diz:
                </span>
                <span style={{ marginLeft: '6px', color: '#333' }}>{msg.content}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Input */}
      <div style={{ height: '140px', padding: '15px', backgroundColor: '#eef5fb', borderTop: '1px solid #a5c3d9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea 
          style={{ flex: 1, border: '1px solid #a5c3d9', padding: '8px', fontSize: '12px', resize: 'none', outline: 'none' }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Digite sua mensagem..."
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="msn-button" onClick={handleSend} style={{ padding: '4px 20px', fontWeight: 'bold' }}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
