import React from 'react';

export default function WindowFrame({ children, title, onClose, onMinimize }) {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden shadow-2xl" 
         style={{ 
           borderRadius: '8px 8px 4px 4px', 
           border: '1px solid #235d81',
           boxShadow: '0 10px 30px rgba(0,0,0,0.3)' 
         }}>
      
      {/* Barra de Título Premium */}
      <div 
        className="flex items-center justify-between px-3 select-none w-full"
        style={{ 
          height: '34px', 
          background: 'linear-gradient(to bottom, #4a89b5 0%, #235d81 100%)',
          borderBottom: '1px solid #1a4561',
          position: 'relative'
        }}
      >
        
        {/* Reflexo de brilho no topo da barra (Vibe Frutiger Aero) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        }}></div>
        
        {/* Lado Esquerdo: Logo + Título */}
        <div className="flex items-center gap-2 z-10">
          <img 
            src="/images/logo-msn.png" 
            alt="MSN" 
            style={{ width: '16px', height: '16px', filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}
          />
          <span style={{ 
            color: 'white', 
            fontSize: '11px', 
            fontWeight: '600', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            letterSpacing: '0.3px'
          }}>
            {title || "Windows Live Messenger"}
          </span>
        </div>

        {/* Lado Direito: Botões (Estilo Windows 7/XP moderno) */}
        <div className="flex items-center gap-1.5 z-10">
          <button 
            onClick={onMinimize}
            className="flex items-center justify-center transition-all"
            style={{ 
              width: '26px', 
              height: '18px', 
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '2px'
            }}
          >
            <div style={{ width: '8px', height: '2px', backgroundColor: 'white', marginTop: '6px' }}></div>
          </button>
          
          <button 
            onClick={onClose}
            className="flex items-center justify-center transition-all hover:bg-[#ff5c5c] active:bg-[#c42b1c]"
            style={{ 
              width: '40px', 
              height: '18px', 
              backgroundColor: '#e81123',
              border: '1px solid #b20000',
              borderRadius: '2px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
            }}
          >
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', marginTop: '-1px' }}>✕</span>
          </button>
        </div>
      </div>

      {/* Conteúdo da Janela com degradê suave de fundo */}
      <div className="flex-1 overflow-hidden flex flex-col relative" 
           style={{ 
             background: 'linear-gradient(to bottom, #eef5fb 0%, #d9e8f5 100%)',
             boxShadow: 'inset 0 0 15px rgba(35, 93, 129, 0.05)'
           }}>
        {children}
      </div>

    </div>
  );
}
