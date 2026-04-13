import React from 'react';

export default function WindowFrame({ children, title, onClose, onMinimize }) {
  return (
    <div 
      className="flex flex-col w-full h-full overflow-hidden shadow-2xl" 
      style={{ 
        borderRadius: '10px 10px 5px 5px', // Mais arredondado como o MSN original
        border: '1px solid #235d81',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        backgroundColor: '#eef5fb'
      }}
    >
      
      {/* Barra de Título Blindada */}
      <div 
        style={{ 
          height: '34px', 
          background: 'linear-gradient(to bottom, #4a89b5 0%, #235d81 100%)',
          borderBottom: '1px solid #1a4561',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          position: 'relative', // Essencial para o absolute dos botões funcionar
          userSelect: 'none'
        }}
      >
        {/* Reflexo Frutiger Aero */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        }}></div>
        
        {/* Lado Esquerdo: Logo + Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
          <img 
            src="/images/logo-msn.png" 
            alt="MSN" 
            style={{ width: '16px', height: '16px', filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}
          />
          <span style={{ 
            color: 'white', 
            fontSize: '11px', 
            fontWeight: 'bold', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
            letterSpacing: '0.2px',
            whiteSpace: 'nowrap'
          }}>
            {title || "Windows Live Messenger"}
          </span>
        </div>

        {/* Lado Direito: Botões Forçados no Canto */}
        <div style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          display: 'flex', 
          gap: '4px', 
          zIndex: 20 
        }}>
          {/* Minimizar */}
          <button 
            onClick={onMinimize}
            style={{ 
              width: '26px', 
              height: '18px', 
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '8px', height: '2px', backgroundColor: 'white', marginTop: '6px' }}></div>
          </button>
          
          {/* Fechar (X) */}
          <button 
            onClick={onClose}
            style={{ 
              width: '36px', 
              height: '18px', 
              backgroundColor: '#e81123',
              border: '1px solid #b20000',
              borderRadius: '2px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Conteúdo com degradê suave */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #eef5fb 0%, #d9e8f5 100%)',
          position: 'relative'
        }}
      >
        {children}
      </div>

    </div>
  );
}
