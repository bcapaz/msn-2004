import React, { useState } from 'react';

const AVATARES_DISPONIVEIS = [
  '/images/avatar-blue.png',
  '/images/avatar-green.png',
  '/images/avatar-pink.png',
  '/images/avatar-orange.png',
  '/images/avatar-red.png',
  '/images/avatar-purple.png'
];

export default function UserProfile({ user, onUpdate }) {
  const [showSelector, setShowSelector] = useState(false);

  const selectAvatar = async (url) => {
    await fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, avatarUrl: url })
    });
    setShowSelector(false);
    window.location.reload(); // Atualiza para mostrar a nova cor
  };

  return (
    <div className="flex p-4 items-start gap-3 bg-gradient-to-b from-white to-[#d9e8f5] relative">
      <div className="relative group cursor-pointer" onClick={() => setShowSelector(!showSelector)}>
        <div className="w-16 h-16 border-2 border-gray-400 p-0.5 bg-white shadow-sm hover:border-blue-500">
          <img src={user?.avatar_url || "/images/default-avatar.png"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold">TROCAR</div>
        </div>
      </div>

      {showSelector && (
        <div className="absolute top-20 left-4 bg-white border border-gray-400 p-2 z-50 grid grid-cols-3 gap-1 shadow-xl">
          {AVATARES_DISPONIVEIS.map(url => (
            <img 
              key={url} 
              src={url} 
              className="w-10 h-10 cursor-pointer hover:scale-110 border border-transparent hover:border-blue-400" 
              onClick={() => selectAvatar(url)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col flex-1">
        <span className="font-bold text-[#235d81] text-lg">{user?.display_name || user?.username}</span>
        <input 
          type="text" 
          className="bg-transparent border-none text-sm text-gray-600 italic focus:ring-1 focus:ring-[#86b9e0] p-0.5 w-full"
          placeholder="<O que você está ouvindo?>"
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
