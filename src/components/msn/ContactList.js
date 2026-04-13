import React from 'react';

export default function ContactList({ contacts = [], onSelectContact }) {
  return (
    <div style={{ 
      flex: 1, 
      backgroundColor: 'white', 
      overflowY: 'auto', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* Cabeçalho da Lista */}
      <div style={{ 
        backgroundColor: '#cfe4f3', 
        padding: '6px 10px', 
        fontSize: '11px', 
        fontWeight: 'bold', 
        color: '#235d81', 
        borderBottom: '1px solid #a5c3d9' 
      }}>
        Delegados ({contacts ? contacts.length : 0})
      </div>

      {/* Lista de Usuários */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {(!contacts || contacts.length === 0) ? (
          <p style={{ padding: '20px', fontSize: '11px', color: '#999', textAlign: 'center', fontStyle: 'italic' }}>
            Nenhum outro delegado encontrado...
          </p>
        ) : (
          contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaf3f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img 
                src={contact.avatar_url || "/images/avatar-blue.png"} 
                style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
                  {contact.display_name || contact.username}
                </span>
                <span style={{ fontSize: '10px', color: '#888', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contact.subnick || ""}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
