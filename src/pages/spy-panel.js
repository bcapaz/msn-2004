import { useState, useEffect } from 'react';
import WindowFrame from '../components/ui/WindowFrame';

export default function SpyPanel() {
  const [logs, setLogs] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser?.isAdmin) {
      window.location.href = '/'; // Expulsa se não for admin
    }
    setAdmin(savedUser);

    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/spy?adminId=${savedUser.id}`);
      const data = await res.json();
      setLogs(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-900 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <WindowFrame title="PAINEL DE MONITORAMENTO - DIRETORIA">
          <div className="p-4 bg-black text-green-500 font-mono text-sm h-[70vh] overflow-y-auto">
            <p className="mb-4 border-b border-green-900 pb-2">
              [SISTEMA]: Monitorando logs de conversas em tempo real...
            </p>
            
            {logs.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-blue-400 ml-2 font-bold">{log.sender?.display_name}</span>
                <span className="text-white mx-1">➜</span>
                <span className="text-orange-400 font-bold">{log.receiver?.display_name}:</span>
                <span className="text-green-300 ml-2 italic">"{log.content}"</span>
              </div>
            ))}
            
            {logs.length === 0 && <p className="animate-pulse">Aguardando tráfego de mensagens...</p>}
          </div>
        </WindowFrame>
        <p className="text-gray-500 mt-2 text-center text-xs uppercase tracking-widest">
          Propriedade da Mesa Diretora - Uso restrito
        </p>
      </div>
    </div>
  );
}
