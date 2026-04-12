import { useState } from 'react';
import { useRouter } from 'next/router';
import WindowFrame from '../components/ui/WindowFrame';

const AVATARES = [
  '/images/avatar-blue.png',
  '/images/avatar-green.png',
  '/images/avatar-purple.png',
  '/images/avatar-orange.png',
  '/images/avatar-red.png',
  '/images/avatar-yellow.png'
];

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [delegacao, setDelegacao] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/images/avatar-blue.png');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ADICIONADO O 'async' AQUI PARA CORRIGIR O ERRO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          delegacao, 
          password, 
          avatarUrl: selectedAvatar 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/messenger');
      } else {
        alert(data.message || 'Erro na autenticação');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex',
      alignItems: 'center', justifyContent: 'center', backgroundColor: '#86b9e0'
    }}>
      <div style={{ width: '450px', height: '520px' }}>
        <WindowFrame title="Windows Live Messenger">
          <form onSubmit={handleSubmit} style={{ 
            padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' 
          }}>
            
            <img src="/images/logo-msn.png" style={{ width: '40px', marginBottom: '10px' }} alt="MSN Logo" />
            <h1 style={{ color: '#235d81', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              {isRegistering ? 'Criar Delegação' : 'Entrar'}
            </h1>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#235d81', marginBottom: '5px', fontWeight: 'bold' }}>
                Escolha seu Avatar:
              </p>
              <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '10px', border: '1px solid #a5c3d9', borderRadius: '8px' }}>
                {AVATARES.map(url => (
                  <img 
                    key={url}
                    src={url}
                    onClick={() => setSelectedAvatar(url)}
                    alt="Avatar Option"
                    style={{ 
                      width: '35px', height: '35px', cursor: 'pointer',
                      border: selectedAvatar === url ? '2px solid #235d81' : '1px solid #ccc',
                      borderRadius: '4px', padding: '2px', backgroundColor: selectedAvatar === url ? '#eef5fb' : 'transparent'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', color: '#235d81', fontWeight: 'bold' }}>Nome da Delegação:</label>
                <input 
                  className="msn-input" 
                  style={{ width: '100%' }}
                  value={delegacao}
                  onChange={(e) => setDelegacao(e.target.value)}
                  placeholder="Username" required 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', color: '#235d81', fontWeight: 'bold' }}>Senha:</label>
                <input 
                  type="password" className="msn-input" 
                  style={{ width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha" required 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="msn-button" style={{ marginTop: '25px', width: '150px', fontWeight: 'bold' }}>
              {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
            </button>

            <p 
              onClick={() => setIsRegistering(!isRegistering)}
              style={{ fontSize: '11px', color: '#004c99', cursor: 'pointer', textDecoration: 'underline', marginTop: '20px' }}
            >
              {isRegistering ? 'Voltar para o Login' : 'Sua delegação não tem conta? Clique aqui'}
            </p>
          </form>
        </WindowFrame>
      </div>
    </div>
  );
}
