import React, { useState } from 'react';

const AVATARES_DISPONIVEIS = [
  '/images/avatar-blue.png',
  '/images/avatar-green.png',
  '/images/avatar-yellow.png',
  '/images/avatar-orange.png',
  '/images/avatar-red.png',
  '/images/avatar-purple.png'
];

export default function UserProfile({ user }) {
  const [showSelector, setShowSelector] = useState(false);

  const selectAvatar = async (url) => {
    try {
      await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, avatarUrl: url })
      });
      setShowSelector(false);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao atualizar avatar");
    }
  };

  return (
    <div className="flex p-4 items-center gap-4 border-b border-[#a5c3d9]" 
         style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #e3eff9 100%)' }}>
      
      {/* Avatar Simplificado */}
      <div className="relative group cursor-pointer" onClick={() => setShowSelector(!showSelector)}>
        <div style={{
          width: '60px', height: '60px', backgroundColor: 'white',
          border: '1px solid #7192ad', padding: '2px', boxShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={user?.avatar_url || "/images/avatar-blue.png"} 
            className="w-full h-full object-contain"
            alt="Profile"
          />
          <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-[8px] text-white font-bold uppercase">Trocar</span>
          </div>
        </div>

        {showSelector && (
          <div className="absolute top-0 left-16 bg-white border border-[#7192ad] p-2 z-50 shadow-2xl flex gap-1 rounded-sm">
            {AVATARES_DISPONIVEIS.map(url => (
              <img 
                key={url} src={url} 
                className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                onClick={(e) => { e.stopPropagation(); selectAvatar(url); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info da Delegação Sem Status */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <span style={{ 
          color: '#235d81', 
          fontWeight: 'bold', 
          fontSize: '16px',
          lineHeight: '1.2'
        }}>
          {user?.display_name || user?.username}
        </span>

        {/* Subnick (Mensagem Pessoal) */}
        <input 
          type="text" 
          className="bg-transparent border-none text-[11px] text-gray-500 italic p-0 w-full focus:ring-0 cursor-text mt-1"
          placeholder="Clique para mudar o subnick"
          defaultValue={user?.subnick}
          onBlur={async (e) => {
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
