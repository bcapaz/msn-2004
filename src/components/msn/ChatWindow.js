import React, { useState, useEffect } from 'react';

export default function ChatWindow({ activeContact, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Busca mensagens
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/list?senderId=${currentUser.id}&receiverId=${activeContact.id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Erro ao buscar mensagens");
      }
    };
    fetchMessages();
    // Opcional: Criar um intervalo para atualizar as mensagens sozinho
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeContact, currentUser]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white' }}>
      
      {/* Topo do Chat - Trava o tamanho do avatar aqui */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '10px', p: '10px', 
        padding: '10px', background: 'linear-gradient(to bottom, #f3f9ff, #d9e8f5)',
        borderBottom: '1px solid #a5c3d9'
      }}>
        <img 
          src={activeContact.avatar_url || "/images/avatar-red.png"} 
          style={{ width: '40px', height: '40px', border: '1px solid #7192ad', padding: '2px', backgroundColor: 'white' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#235d81' }}>
            {activeContact.display_name || activeContact.username}
          </span>
          <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
            {activeContact.subnick || "Disponível"}
          </span>
        </div>
      </div>

      {/* Histórico de Mensagens com Scroll */}
      <div style={{ 
        flex: 1, 
        padding: '15px', 
        overflowY: 'auto', // ATIVA O SCROLL
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc', fontSize: '11px', marginTop: '20px' }}>
            Nenhuma mensagem trocada ainda.
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ fontSize: '12px' }}>
              <span style={{ 
                fontWeight: 'bold', 
                color: msg.senderId === currentUser.id ? '#235d81' : '#d15b00' 
              }}>
                {msg.sender?.display_name || msg.sender?.username} diz:
              </span>
              <span style={{ marginLeft: '5px', color: '#333' }}>{msg.content}</span>
            </div>
          ))
        )}
      </div>

      {/* Área de Digitação */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#eef5fb', 
        borderTop: '1px solid #a5c3d9',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        <textarea 
          style={{ 
            width: '100%', height: '60px', border: '1px solid #a5c3d9', 
            padding: '5px', fontSize: '12px', outline: 'none', resize: 'none'
          }}
          placeholder="Digite sua mensagem..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="msn-button"
            style={{ padding: '4px 20px', fontWeight: 'bold' }}
            onClick={async () => {
              if(!inputText.trim()) return;
              await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  senderId: currentUser.id,
                  receiverId: activeContact.id,
                  content: inputText
                })
              });
              setInputText('');
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
