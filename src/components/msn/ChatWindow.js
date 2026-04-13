import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll automático para a última mensagem
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
    const interval = setInterval(fetchMessages, 2000); // Poll a cada 2s
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
      // Busca imediata após enviar para não parecer que travou
      const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Erro ao enviar");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#fff' }}>
      
      {/* Cabeçalho da Conversa */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px',
        background: 'linear-gradient(to bottom, #ffffff 0%, #d9e8f5 100%)',
        borderBottom: '1px solid #a5c3d9'
      }}>
        <div style={{ width: '42px', height: '42px', border: '1px solid #7192ad', padding: '2px', backgroundColor: 'white' }}>
          <img src={activeContact.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#235d81' }}>{activeContact.display_name}</span>
          <span style={{ fontSize: '10px', color: '#235d81', opacity: 0.8 }}>{activeContact.subnick || 'Disponível'}</span>
        </div>
      </div>

      {/* Área das Mensagens (Histórico) */}
      <div style={{ 
        flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px',
        backgroundColor: '#fff', borderBottom: '1px solid #a5c3d9'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <span style={{ 
              fontWeight: 'bold', 
              color: msg.senderId === currentUser.id ? '#235d81' : '#d15b00' 
            }}>
              {msg.sender?.display_name || msg.sender?.username} diz:
            </span>
            <span style={{ marginLeft: '6px', color: '#333' }}>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Input */}
      <div style={{ padding: '12px', backgroundColor: '#eef5fb', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea 
          style={{ 
            width: '100%', height: '70px', border: '1px solid #a5c3d9', borderRadius: '2px',
            padding: '8px', fontSize: '12px', outline: 'none', resize: 'none', fontFamily: 'Tahoma'
          }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Digite sua mensagem..."
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="msn-button" style={{ padding: '5px 25px', fontSize: '12px' }} onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
