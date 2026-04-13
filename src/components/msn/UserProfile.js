import React from 'react';

export default function UserProfile({ user }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center', // Alinha avatar e texto na horizontal
      gap: '12px',
      padding: '15px',
      borderBottom: '1px solid #a5c3d9',
      background: 'linear-gradient(to bottom, #ffffff 0%, #e3eff9 100%)'
    }}>
      
      {/* Moldura do Avatar (Tamanho fixo de 60px) */}
      <div style={{
        width: '60px',
        height: '60px',
        backgroundColor: 'white',
        border: '1px solid #7192ad',
        padding: '2px',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={user?.avatar_url || "/images/avatar-blue.png"} 
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Info da Delegação (Lado direito do avatar) */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Nome da Delegação */}
        <span style={{ 
          color: '#235d81', 
          fontWeight: 'bold', 
          fontSize: '15px',
          lineHeight: '1.2'
        }}>
          {user?.display_name || user?.username}
        </span>

        {/* Subnick (Mensagem Pessoal) */}
        <input 
          type="text" 
          defaultValue={user?.subnick}
          placeholder="Clique para mudar o subnick"
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '11px',
            color: '#666',
            fontStyle: 'italic',
            padding: '0',
            marginTop: '3px',
            width: '100%',
            outline: 'none'
          }}
          onBlur={async (e) => {
            // Lógica de atualização (opcional aqui)
            await fetch('/api/users/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, subnick: e.target.value })
            });
          }}
        />
      </div>

    </div>
  );
}
