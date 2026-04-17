import React, { useState, useEffect, useRef } from 'react';

export default function SpyPanel({ currentUser }) {
  const [delegates, setDelegates] = useState([]);
  const [userA, setUserA] = useState(null);
  const [userB, setUserB] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 1. Carrega todos os delegados
  useEffect(() => {
    fetch('/api/users/list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDelegates(data.filter(u => !u.isAdmin));
      });
  }, []);

  // 2. Busca as mensagens entre User A e User B
  const fetchSpyMessages = async () => {
    if (!userA || !userB) return;
    try {
      const res = await fetch(`/api/messages/list?senderId=${userA.id}&receiverId=${userB.id}`);
      if (res.ok) {
        const data = await res.json();
        if (JSON.stringify(data) !== JSON.stringify(messages)) {
          setMessages(data);
        }
      }
    } catch (e) {
      console.error("Erro na escuta");
    }
  };

  useEffect(() => {
    fetchSpyMessages();
    const interval = setInterval(fetchSpyMessages, 2000);
    return () => clearInterval(interval);
  }, [userA, userB, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', color: '#eee', fontFamily: 'monospace' }}>
      
      {/* Header Direção */}
      <div style={{ height: '60px', backgroundColor: '#0d0d0d', borderBottom: '2px solid #b20000', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff4d4d', boxShadow: '0 0 10px #ff4d4d', animation: 'pulse 2s infinite' }}></div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', color: '#fff' }}>SISTEMA DE VIGILÂNCIA BILATERAL - DIREÇÃO</h1>
        </div>
        <div style={{ fontSize: '14px', color: '#888' }}>Logado como: <span style={{ color: '#fff' }}>{currentUser.username}</span></div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Lado Esquerdo: Seleção de Alvos */}
        <div style={{ width: '350px', backgroundColor: '#141414', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', padding: '20px', gap: '20px' }}>
          
          {/* Seletor Alvo 1 */}
          <div>
            <label style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>SELECIONAR DELEGAÇÃO 1 (ALVO A):</label>
            <select 
              style={{ width: '100%', padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', outline: 'none', cursor: 'pointer' }}
              onChange={(e) => setUserA(delegates.find(d => d.id === parseInt(e.target.value)))}
              value={userA?.id || ""}
            >
              <option value="" disabled>-- Escolha um delegado --</option>
              {delegates.map(d => (
                <option key={d.id} value={d.id}>{d.display_name || d.username}</option>
              ))}
            </select>
          </div>

          {/* Seletor Alvo 2 */}
          <div>
            <label style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>SELECIONAR DELEGAÇÃO 2 (ALVO B):</label>
            <select 
              style={{ width: '100%', padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', outline: 'none', cursor: 'pointer' }}
              onChange={(e) => setUserB(delegates.find(d => d.id === parseInt(e.target.value)))}
              value={userB?.id || ""}
              disabled={!userA}
            >
              <option value="" disabled>-- Escolha o interlocutor --</option>
              {delegates.filter(d => d.id !== userA?.id).map(d => (
                <option key={d.id} value={d.id}>{d.display_name || d.username}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 'auto', padding: '15px', backgroundColor: '#2a0000', border: '1px solid #660000', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#ff6666', lineHeight: '1.5' }}>
              <strong>Aviso:</strong> A intercepção de mensagens é invisível para os delegados. O painel atualiza a cada 2 segundos.
            </p>
          </div>

        </div>

        {/* Lado Direito: Tela de Intercepção (O Chat) */}
        <div style={{ flex: 1, backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', padding: '20px' }}>
          
          <div style={{ border: '1px solid #333', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#111', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
            
            {/* Header do Log */}
            <div style={{ padding: '10px 15px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', fontSize: '13px', color: '#888' }}>
              {userA && userB ? (
                <span>INTERCEPTANDO COMUNICAÇÃO: <strong style={{ color: '#5dade2' }}>{userA.display_name}</strong> ↔ <strong style={{ color: '#e67e22' }}>{userB.display_name}</strong></span>
              ) : (
                <span>AGUARDANDO SELEÇÃO DE ALVOS...</span>
              )}
            </div>

            {/* Log de Mensagens */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!userA || !userB ? (
                <div style={{ textAlign: 'center', color: '#444', marginTop: '100px' }}>[ NENHUM CANAL ABERTO ]</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#444', marginTop: '100px' }}>[ NENHUMA COMUNICAÇÃO REGISTRADA ENTRE OS ALVOS ]</div>
              ) : (
                messages.map((msg, i) => {
                  const isUserA = msg.senderId === userA.id;
                  const senderName = isUserA ? userA.display_name : userB.display_name;
                  const color = isUserA ? '#5dade2' : '#e67e22'; // Cores distintas para os dois lados

                  return (
                    <div key={i} style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      <span style={{ color: '#555' }}>[{new Date(msg.timestamp).toLocaleTimeString()}]</span>{' '}
                      <strong style={{ color: color }}>{senderName.toUpperCase()}:</strong>{' '}
                      <span style={{ color: '#ddd' }}>{msg.content}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

          </div>
        </div>

      </div>

      {/* Animaçãozinha do Header */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>

    </div>
  );
}
