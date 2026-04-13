import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
        const data = await res.json();
        if (JSON.stringify(data) !== JSON.stringify(messages)) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Erro ao buscar mensagens");
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [activeContact, currentUser, messages]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const currentMsg = inputText;
    setInputText('');

    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: activeContact.id,
          content: currentMsg
        })
      });
      const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Erro ao enviar");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#fff' }}>
      
      {/* 1. CABEÇALHO: Altura fixa de 70px */}
      <div style={{ 
        height: '70px', minHeight: '70px', display: 'flex', alignItems: 'center', gap: '12px', 
        padding: '0 15px', background: 'linear-gradient(to bottom, #ffffff 0%, #d9e8f5 100%)',
        borderBottom: '1px solid #a5c3d9'
      }}>
        <div style={{ width: '45px', height: '45px', border: '1px solid #7192ad', padding: '2px', backgroundColor: 'white' }}>
          <img src={activeContact.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#235d81', whiteSpace: 'nowrap' }}>
            {activeContact.display_name}
          </span>
          <span style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
            {activeContact.subnick || 'Disponível'}
          </span>
        </div>
      </div>

      {/* 2. HISTÓRICO: flex: 1 faz ele ocupar o meio e ter SCROLL */}
      <div style={{ 
        flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px',
        backgroundColor: '#fff'
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc', fontSize: '11px', marginTop: '20px' }}>
            Nenhuma mensagem trocada ainda.
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <span style={{ 
                fontWeight: 'bold', 
                color: msg.senderId === currentUser.id ? '#235d81' : '#d15b00' 
              }}>
                {msg.sender?.display_name || msg.sender?.username} diz:
              </span>
              <span style={{ marginLeft: '6px', color: '#333' }}>{msg.content}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT: Fixo no rodapé com altura de 140px */}
      <div style={{ 
        height: '140px', minHeight: '140px', padding: '15px', backgroundColor: '#eef5fb', 
        borderTop: '1px solid #a5c3d9', display: 'flex', flexDirection: 'column', gap: '8px' 
      }}>
        <textarea 
          style={{ 
            flex: 1, width: '100%', border: '1px solid #a5c3d9', borderRadius: '2px',
            padding: '8px', fontSize: '12px', outline: 'none', resize: 'none', fontFamily: 'Tahoma'
          }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Digite sua mensagem..."
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="msn-button" style={{ padding: '4px 20px', fontSize: '12px', fontWeight: 'bold' }} onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
