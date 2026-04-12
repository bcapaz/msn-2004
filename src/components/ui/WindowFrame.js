import React from 'react';

export default function WindowFrame({ children, title, onClose, onMinimize }) {
  return (
    <div className="msn-window flex flex-col w-full h-full overflow-hidden shadow-2xl border border-[#235d81]/30">
      
      {/* Barra de Título (Title Bar) */}
      <div className="h-8 bg-gradient-to-r from-[#235d81] via-[#4a89b5] to-[#86b9e0] flex items-center justify-between px-2 select-none">
        
        {/* Lado Esquerdo: Ícone e Título */}
        <div className="flex items-center gap-2">
          <img src="/images/logo-msn.png" alt="MSN" className="w-4 h-4" />
          <span className="text-white text-xs font-semibold shadow-sm">
            {title || "Windows Live Messenger"}
          </span>
        </div>

        {/* Lado Direito: Botões de Controle */}
        <div className="flex items-center gap-1">
          {/* Minimizar */}
          <button 
            onClick={onMinimize}
            className="w-6 h-5 bg-white/20 hover:bg-white/40 flex items-center justify-center rounded-sm transition-colors"
          >
            <div className="w-2.5 h-0.5 bg-white mt-2"></div>
          </button>
          
          {/* Maximizar (Desabilitado ou apenas visual) */}
          <button className="w-6 h-5 bg-white/20 hover:bg-white/40 flex items-center justify-center rounded-sm opacity-50 cursor-not-allowed">
            <div className="w-2.5 h-2.5 border border-white"></div>
          </button>

          {/* Fechar */}
          <button 
            onClick={onClose}
            className="w-8 h-5 bg-[#e81123]/80 hover:bg-[#e81123] flex items-center justify-center rounded-sm transition-colors"
          >
            <span className="text-white text-xs font-bold mt-[-2px]">✕</span>
          </button>
        </div>
      </div>

      {/* Conteúdo da Janela */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#eef5fb]">
        {children}
      </div>
        </div>
      </div>
    </div>
  );
}
