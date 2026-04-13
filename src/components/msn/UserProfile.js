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
    <div className="flex p-4 items-start gap-4 border-b border-[#a5c3d9]" 
         style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #e3eff9 100%)' }}>
      
      {/* Moldura do Avatar Estilo MSN 7.5 */}
      <div className="relative group cursor-pointer" onClick={() => setShowSelector(!showSelector)}>
        <div style={{
          width: '68px',
          height: '68px',
          backgroundColor: 'white',
          border: '1px solid #7192ad',
          padding: '3px',
          boxShadow: '1px 1px 3px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            border: '1px solid #a5c3d9',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img 
              src={user?.avatar_url || "/images/avatar-blue.png"} 
              className="w-full h-full object-contain"
              alt="Profile"
            />
            {/* Overlay de Troca */}
            <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[9px] text-white font-bold uppercase tracking-tighter">Trocar</span>
            </div>
          </div>
        </div>

        {/* Seletor Flutuante de Avatares */}
        {showSelector && (
          <div className="absolute top-0 left-20 bg-white border border-[#7192ad] p-2 z-50 shadow-2xl flex gap-2 rounded-sm"
               style={{ minWidth: '150px' }}>
            {AVATARES_DISPONIVEIS.map(url => (
              <img 
                key={url} 
                src={url} 
                className="w-8 h-8 cursor-pointer hover:border-blue-500 border border-transparent p-0.5 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  selectAvatar(url);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info do Usuário */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Nome com Sombra Suave */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span style={{ 
            color: '#235d81', 
            fontWeight: 'bold', 
            fontSize: '15px',
            textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.8)'
          }}>
        </div>

        {/* Subnick (Mensagem Pessoal) */}
        <div className="relative group/input w-full">
          <input 
            type="text" 
            className="bg-transparent border-none text-[11px] text-gray-600 italic p-0 w-full focus:ring-0 cursor-text hover:bg-white/40 transition-colors"
            placeholder="<Clique para inserir uma mensagem pessoal>"
            defaultValue={user?.subnick}
            style={{ fontFamily: 'Tahoma, sans-serif' }}
            onBlur={async (e) => {
              await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, subnick: e.target.value })
              });
            }}
          />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-300 scale-x-0 group-hover/input:scale-x-100 transition-transform origin-left"></div>
        </div>

        {/* Linha de Status (Abaixo do subnick) */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] text-[#235d81] font-medium opacity-80 cursor-default">
            (Disponível)
          </span>
        </div>
      </div>

    </div>
  );
}
