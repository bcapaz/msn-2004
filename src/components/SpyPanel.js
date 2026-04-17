import React, { useState, useEffect, useRef } from 'react';

export default function SpyPanel({ currentUser }) {
  const [delegates, setDelegates] = useState([]);
  const [userA, setUserA] = useState(null);
  const [userB, setUserB] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('/api/users/list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDelegates(data.filter(u => !u.isAdmin));
      });
  }, []);

  const fetchSpyMessages = async () => {
    if (!userA || !userB) return;
    try {
      const res = await fetch(`/api/messages/list?senderId=${userA.id}&receiverId=${userB.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) { console.error("Erro na interceptação"); }
  };

  useEffect(() => {
    fetchSpyMessages();
    const interval = setInterval(fetchSpyMessages, 3000);
    return () => clearInterval(interval);
  }, [userA, userB]);

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#0f0f0f', display: 'flex', flexDirection: 'column', color: '#00ff00', fontFamily: 'monospace' }}>
      
      {/* Header Direção */}
      <div style={{ height: '50px', backgroundColor: '#000', borderBottom: '2px solid #333', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff0000', boxShadow: '0 0 5px #ff0000' }}></div>
          <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>ADMIN CONSOLE: MODO ESPREITA</span>
        </div>
        <span style={{ fontSize: '12px', color: '#666' }}>DIRETOR: {currentUser.username}</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Seletor Lateral */}
        <div style={{ width: '300px', backgroundColor: '#151515', padding: '20px', borderRight: '1px solid #333' }}>
          <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '10px' }}>ALVO 1 (DELEGADO A):</label>
          <select 
            style={{ width: '100%', padding: '8px', backgroundColor: '#222', color: '#0f0', border: '1px solid #444', marginBottom: '20px' }}
            onChange={(e) => setUserA(delegates.find(d => d.id === parseInt(e.target.value)))}
          >
            <option value="">Selecione...</option>
            {delegates.map(d => <option key={d.id} value={d.id}>{d.display_name || d.username}</option>)}
          </select>

          <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '10px' }}>ALVO 2 (DELEGADO B):</label>
          <select 
            style={{ width: '100%', padding: '8px', backgroundColor: '#222', color: '#0f0', border: '1px solid #444' }}
            onChange={(e) => setUserB(delegates.find(d => d.id === parseInt(e.target.value)))}
            disabled={!userA}
          >
            <option value="">Selecione...</option>
            {delegates.filter(d => d.id !== userA?.id).map(d => <option key={d.id} value={d.id}>{d.display_name || d.username}</option>)}
          </select>
        </div>

        {/* Área de Log das Mensagens */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#050505' }}>
          {userA && userB ? (
            <div>
              <p style={{ color: '#444', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                &gt; INTERCEPTANDO CANAL: {userA.display_name} vs {userB.display_name}
              </p>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>[{new Date(msg.timestamp).toLocaleTimeString()}]</span>{' '}
                  <strong style={{ color: msg.senderId === userA.id ? '#5dade2' : '#e67e22' }}>
                    {msg.senderId === userA.id ? userA.display_name : userB.display_name}:
                  </strong>{' '}
                  <span style={{ color: '#ccc' }}>{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <p style={{ color: '#333', textAlign: 'center', marginTop: '100px' }}>AGUARDANDO DEFINIÇÃO DE ALVOS...</p>
          )}
        </div>
      </div>
    </div>
  );
}
