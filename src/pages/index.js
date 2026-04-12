import { useState } from 'react';
import WindowFrame from '../components/ui/WindowFrame';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [delegacao, setDelegacao] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#86b9e0',
      fontFamily: 'Segoe UI, Tahoma, sans-serif'
    }}>
      {/* Container da Janela Principal */}
      <div style={{ width: '380px', height: '550px', position: 'relative' }}>
        <WindowFrame title="Windows Live Messenger">
          
          <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Logo e Título de Boas-vindas */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <img 
                src="/images/logo-msn.png" 
                style={{ width: '60px', marginBottom: '10px' }} 
              />
              <h1 style={{ color: '#235d81', fontSize: '18px', fontWeight: 'bold' }}>
                {isRegistering ? 'Criar nova conta' : 'Entrar'}
              </h1>
            </div>

            {/* Avatar Central com moldura de 2004 */}
            <div style={{
              width: '100px',
              height: '100px',
              border: '1px solid #a5c3d9',
              padding: '4px',
              backgroundColor: 'white',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
              marginBottom: '25px'
            }}>
              <img 
                src="/images/avatar-blue.png" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>

            {/* Inputs Estilizados */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', color: '#235d81', fontWeight: 'bold', marginBottom: '4px' }}>
                  Nome da Delegação:
                </label>
                <input 
                  type="text" 
                  className="msn-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="Nome da Delegação"
                  value={delegacao}
                  onChange={(e) => setDelegacao(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', color: '#235d81', fontWeight: 'bold', marginBottom: '4px' }}>
                  Senha:
                </label>
                <input 
                  type="password" 
                  className="msn-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botão de Ação Principal */}
            <button className="msn-button" style={{ 
              marginTop: '30px', 
              width: '120px', 
              padding: '8px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {isRegistering ? 'Cadastrar' : 'Entrar'}
            </button>

            {/* Alternar entre Login e Registro */}
            <div style={{ marginTop: '25px', textAlign: 'center' }}>
              <p 
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ fontSize: '11px', color: '#004c99', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isRegistering 
                  ? 'Já possui uma delegação? Entre aqui' 
                  : 'Sua delegação ainda não tem conta? Clique aqui'}
              </p>
            </div>

          </div>
        </WindowFrame>
      </div>
    </div>
  );
}
