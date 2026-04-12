import React from 'react';

export default function WindowFrame({ children, title, onClose, onMinimize }) {
  return (
    <div className="msn-window flex flex-col w-full h-full overflow-hidden shadow-2xl border border-[#235d81]/30 bg-[#eef5fb]">
      
      {/* Barra de Título */}
      <div 
        className="flex items-center justify-between px-2 select-none w-full bg-gradient-to-r from-[#235d81] via-[#4a89b5] to-[#86b9e0]"
        style={{ height: '32px', minHeight: '32px' }}
      >
        
        {/* Lado Esquerdo: Logo + Título */}
        <div className="flex items-center gap-2 overflow-hidden">
          <img 
            src="/images/logo-msn.png" 
            alt="MSN" 
            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          />
          <span className="text-white text-[11px] font-bold truncate whitespace-nowrap">
            {title || "Windows Live Messenger"}
          </span>
        </div>

        {/* Lado Direito: Botões */}
        <div className="flex items-center gap-1 ml-2">
          {/* Minimizar */}
          <button 
            onClick={onMinimize}
            className="bg-white/20 hover:bg-white/40 flex items-center justify-center rounded-sm transition-colors"
            style={{ width: '24px', height: '18px' }}
          >
            <div style={{ width: '10px', height: '2px', backgroundColor: 'white', marginTop: '6px' }}></div>
          </button>
          
          {/* Fechar */}
          <button 
            onClick={onClose}
            className="bg-[#e81123]/80 hover:bg-[#e81123] flex items-center justify-center rounded-sm transition-colors"
            style={{ width: '32px', height: '18px' }}
          >
            <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>✕</span>
          </button>
        </div>
      </div>

      {/* Conteúdo da Janela */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-[#eef5fb]">
        {children}
      </div>

    </div>
  );
}
