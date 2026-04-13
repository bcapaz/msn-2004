import React, { useState, useEffect } from 'react';

export default function ContactList({ contacts, onSelectContact, currentUser }) {
  const [unreadCounts, setUnreadCounts] = useState({});

  // Busca notificações de novas mensagens a cada 3 segundos
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await fetch(`/api/messages/notifications?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json(); // Retorna algo como { "id_do_contato": 2 }
          setUnreadCounts(data);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações");
      }
    };

    const interval = setInterval(checkNotifications, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <div style={{ flex: 1, backgroundColor: 'white', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* Cabeçalho da Lista */}
      <div style={{ 
        backgroundColor: '#cfe4f3', 
        padding: '6px 10px', 
        fontSize: '11px', 
        fontWeight: 'bold', 
        color: '#235d81', 
        borderBottom: '1px solid #a5c3d9' 
      }}>
        Delegados ({contacts.length})
      </div>

      {/* Lista de Usuários */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {contacts.length === 0 ? (
          <p style={{ padding: '20px', fontSize: '11px', color: '#999', textAlign: 'center', fontStyle: 'italic' }}>
            Nenhum outro delegado encontrado...
          </p>
        ) : (
          contacts.map((contact) => {
            const count = unreadCounts[contact.id] || 0;
            
            return (
              <div 
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaf3f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Avatar */}
                <img 
                  src={contact.avatar_url || "/images/avatar-blue.png"} 
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
                />

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: count > 0 ? 'bold' : '500', 
                      color: count > 0 ? '#000' : '#333' 
                    }}>
                      {contact.display_name || contact.username}
                    </span>

                    {/* BOLINHA DE NOTIFICAÇÃO (Estilo MSN) */}
                    {count > 0 && (
                      <div style={{
                        backgroundColor: '#e81123',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                        boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        marginRight: '5px'
                      }}>
                        {count}
                      </div>
                    )}
                  </div>
                  
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#888', 
                    fontStyle: 'italic', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {contact.subnick || ""}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
