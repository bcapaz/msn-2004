import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      // Passamos os IDs como query params
      const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Erro ao carregar chat");
    }
  };

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 3000);
    return () => clearInterval(timer);
  }, [activeContact.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
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
    fetchMessages(); // Atualiza logo após enviar
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Topo do Chat */}
      <div style={{ height: '70px', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(to bottom, #fff, #d9e8f5)', borderBottom: '1px solid #a5c3d9' }}>
        <img src={activeContact.avatar_url} style={{ width: '45px', height: '45px', border: '1px solid #7192ad', padding: '2px', background: 'white' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#235d81' }}>{activeContact.display_name}</div>
          <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{activeContact.subnick}</div>
        </div>
      </div>

      {/* Histórico */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: 'white' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '6px', fontSize: '12px' }}>
            <span style={{ fontWeight: 'bold', color: msg.senderId === currentUser.id ? '#235d81' : '#d15b00' }}>
              {msg.sender?.display_name || 'Delegado'}:
            </span>
            <span style={{ marginLeft: '6px' }}>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ height: '140px', padding: '15px', backgroundColor: '#eef5fb', borderTop: '1px solid #a5c3d9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea 
          style={{ flex: 1, border: '1px solid #a5c3d9', padding: '8px', fontSize: '12px', resize: 'none' }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="msn-button" onClick={sendMessage} style={{ padding: '4px 20px' }}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
