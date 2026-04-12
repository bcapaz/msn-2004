import React from 'react';

export default function UserProfile({ user }) {
  return (
    <div className="flex p-4 items-start gap-3 bg-gradient-to-b from-white to-[#d9e8f5]">
      {/* Avatar clássico com borda */}
      <div className="relative">
        <div className="w-16 h-16 border-2 border-gray-400 p-0.5 bg-white shadow-sm">
          <img 
            src={user?.avatar_url || "/images/default-avatar.png"} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Ícone de Status (Bolinha verde/vermelha) */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5">
           <img src={`/images/status-${user?.status || 'online'}.png`} alt="status" />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#235d81] text-lg">
            {user?.display_name || user?.username}
          </span>
          <span className="text-gray-500 text-sm">(Disponível)</span>
        </div>
        
        {/* O famoso Subnick */}
        <input 
          type="text" 
          placeholder="<Insira uma mensagem pessoal aqui>"
          className="bg-transparent border-none text-sm text-gray-600 italic focus:ring-1 focus:ring-[#86b9e0] p-0.5"
          defaultValue={user?.subnick}
        />
      </div>
    </div>
  );
}
