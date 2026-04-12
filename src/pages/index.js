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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delegacao, password }),
      });

      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/messenger');
      } else {
        alert('Delegação ou senha incorretas!');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#86b9e0]">
      <div className="w-[350px] h-[520px]">
        <WindowFrame title="Windows Live Messenger">
          <div className="flex flex-col items-center p-8 pt-12">
            
            {/* Avatar Centralizado com Borda */}
            <div className="w-28 h-28 border-2 border-gray-300 p-1 bg-white shadow-inner mb-8">
              <img 
                src="https://i.imgur.com/83pZp.png" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Formulário de Login */}
            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div className="flex flex-col">
                <label className="text-xs text-[#235d81] font-bold mb-1">Nome da Delegação:</label>
                <input 
                  type="text"
                  value={delegacao}
                  onChange={(e) => setDelegacao(e.target.value)}
                  className="msn-input w-full text-sm" 
                  placeholder="Ex: Japão"
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
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="remember" className="w-3 h-3" />
                <label htmlFor="remember" className="text-[11px] text-gray-600 cursor-pointer">Lembrar minha delegação</label>
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

            <div className="mt-8 flex flex-col items-center gap-1">
              <span className="text-[11px] text-blue-700 hover:underline cursor-pointer">Esqueceu sua senha?</span>
              <span className="text-[11px] text-blue-700 hover:underline cursor-pointer">Criar uma nova conta</span>
            </div>
          </div>
        </WindowFrame>
      </div>
    </div>
  );
}
