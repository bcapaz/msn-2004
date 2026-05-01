import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import WindowFrame from '../components/ui/WindowFrame';
import UserProfile from '../components/msn/UserProfile';
import ContactList from '../components/msn/ContactList';
import ChatWindow from '../components/msn/ChatWindow';

export default function MessengerPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      router.push('/');
    } else {
      setCurrentUser(JSON.parse(loggedUser));
    }
  }, [router]);

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      fetch('/api/users/list')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const otherDelegates = data.filter(u => u.id !== currentUser.id && !u.isAdmin);
            setContacts(otherDelegates);
          }
        })
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <>
      <Head>
        <title>{currentUser.display_name || currentUser.username} - MSN</title>
      </Head>

      {/* 1. MÁGICA GLOBAL: Desbloqueia qualquer trava de rolagem que o Next.js tenha posto */}
      <style jsx global>{`
        html, body, #__next {
          height: auto !important;
          min-height: 100vh !important;
          overflow-y: auto !important;
        }
      `}</style>

      {/* 2. O FUNDO DA PÁGINA: Agora ele age como uma tela com scroll próprio */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#86b9e0',
        overflowY: 'auto', /* HABILITA A BARRA DE ROLAGEM GERAL DA PÁGINA */
        padding: '40px 0' /* Dá espaço em cima e embaixo para não colar nas bordas */
      }}>
        
        {/* Usamos margin: '0 auto' no lugar de flexbox para garantir que a rolagem funcione */}
        <div style={{ width: '950px', height: '650px', margin: '0 auto' }}>
          <WindowFrame title={`Windows Live Messenger - ${currentUser.display_name || currentUser.username}`}>
            
            {/* 3. CONTEÚDO INTERNO: calc(100% - 32px) desconta a barra superior do WindowFrame! */}
            <div style={{ 
              display: 'flex', 
              width: '100%', 
              height: 'calc(100% - 32px)', 
              backgroundColor: '#eef5fb',
              overflow: 'hidden' /* Garante que nada vaze e quebre a interface */
            }}>
              
              {/* Coluna Esquerda */}
              <div style={{ width: '280px', height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #a5c3d9' }}>
                <UserProfile user={currentUser} />
                <ContactList contacts={contacts} onSelectContact={setActiveContact} />
              </div>

              {/* Coluna Direita (Chat) */}
              <div style={{ flex: 1, height: '100%', backgroundColor: 'white', overflow: 'hidden' }}>
                {activeContact ? (
                  <ChatWindow activeContact={activeContact} currentUser={currentUser} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
                    <img src="/images/logo-msn.png" style={{ width: '100px', opacity: '0.2' }} />
                    <p style={{ color: '#235d81', fontSize: '13px' }}>Selecione um delegado para conversar</p>
                  </div>
                )}
              </div>

            </div>
          </WindowFrame>
        </div>
      </div>
    </>
  );
}
