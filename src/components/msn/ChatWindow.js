import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
      if (res.ok) {
        const data = await res.json();
        // Só atualiza se o número de mensagens mudou (evita re-renders infinitos)
        if (data.length !== messages.length) {
          setMessages(data);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens do servidor");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Tenta buscar novas mensagens a cada 3s
    return () => clearInterval(interval);
  }, [activeContact, currentUser, messages.length]); // Dependência no length ajuda a trigger o scroll

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const msgParaEnviar = inputText;
    setInputText(''); // Limpa o campo na hora para parecer rápido

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: activeContact.id,
          content: msgParaEnviar
        })
      });

      if (res.ok) {
        await fetchMessages(); // Busca as mensagens de novo logo após enviar
      }
    } catch (err) {
      alert("Erro ao enviar mensagem!");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#fff' }}>
      
      {/* Cabeçalho Fixo */}
      <div style={{ 
        height: '70px', minHeight: '70px', display: 'flex', alignItems: 'center', gap: '12px', 
        padding: '0 15px', background: 'linear-gradient(to bottom, #ffffff 0%, #d9e8f5 100%)',
        borderBottom: '1px solid #a5c3d9'
      }}>
        <div style={{ width: '45px', height: '45px', border: '1px solid #7192ad', padding: '2px', backgroundColor: 'white' }}>
          <img src={activeContact.avatar_url || "/images/avatar-red.png"} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#235d81' }}>{activeContact.display_name}</span>
          <span style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{activeContact.subnick || 'Disponível'}</span>
        </div>
      </div>

      {/* HISTÓRICO: Onde as mensagens APARECEM */}
      <div style={{ 
        flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px',
        backgroundColor: '#fff'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: '11px', marginTop: '30px' }}>
            Nenhuma mensagem trocada ainda.
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <span style={{ 
                fontWeight: 'bold', 
                color: msg.senderId === currentUser.id ? '#235d81' : '#d15b00' 
              }}>
                {msg.sender?.display_name || msg.sender?.username} diz:
              </span>
              <span style={{ marginLeft: '6px', color: '#333', wordBreak: 'break-word' }}>
                {msg.content}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ÁREA DE INPUT */}
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
