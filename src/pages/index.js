import { useState } from 'react';
import { useRouter } from 'next/router';
import WindowFrame from '../components/ui/WindowFrame';

export default function Login() {
  const [delegacao, setDelegacao] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ... (sua lógica de login permanece igual)
    setTimeout(() => {
        router.push('/messenger');
        setLoading(false);
    }, 1000); // Teste básico
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#86b9e0]">
      {/* Container com tamanho fixo para a janela de login */}
      <div style={{ width: '350px', height: '520px' }}>
        <WindowFrame title="Windows Live Messenger">
          <div className="flex flex-col items-center p-8 pt-12">
            
            {/* Avatar Centralizado com Borda - Tamanho forçado por estilo inline */}
            <div 
              className="border-2 border-gray-300 p-1 bg-white shadow-inner mb-8"
              style={{ width: '112px', height: '112px' }} // w-28 em pixels
            >
              <img 
                src="/images/default-avatar.png" 
                alt="Avatar" 
                className="object-cover"
                style={{ width: '100%', height: '100%' }} // Preenche o container
              />
            </div>

            {/* Formulário de Login */}
            <form onSubmit={handleLogin} className="w-full space-y-3">
              {/* ... (campos de input permanecem iguais) */}
              <div className="flex flex-col">
                <label className="text-xs text-[#235d81] font-bold mb-1">Nome da Delegação:</label>
                <input 
                  type="text"
                  value={delegacao}
                  onChange={(e) => setDelegacao(e.target.value)}
                  className="msn-input w-full text-sm" 
                  placeholder="Nome da Delegação"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-[#235d81] font-bold mb-1">Senha:</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="msn-input w-full text-sm" 
                  placeholder="Senha"
                  required
                />
              </div>
              <div className="pt-6 flex justify-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="msn-button w-32 font-bold py-1.5"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </WindowFrame>
      </div>
    </div>
  );
}
