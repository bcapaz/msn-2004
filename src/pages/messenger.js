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
    // Busca usuário logado
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      router.push('/');
    } else {
      setCurrentUser(JSON.parse(loggedUser));
    }
  }, [router]);

  useEffect(() => {
    // Busca lista de contatos (outras delegações)
    if (currentUser) {
      fetch('/api/users/list')
        .then(res => res.json())
        .then(data => setContacts(data.filter(u => u.id !== currentUser.id)))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <>
      <Head>
        <title>{currentUser.display_name || currentUser.username} - Windows Live Messenger</title>
      </Head>

      {/* Container Principal que centraliza a janela */}
      <div style={{
        height: '100vh', width: '100vw', display: 'flex',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#86b9e0',
        overflow: 'hidden'
      }}>
        
        {/* Janela do MSN com tamanho fixo clássico */}
        <div style={{ width: '900px', height: '650px', display: 'flex' }}>
          <WindowFrame title={`Windows Live Messenger - ${currentUser.display_name || currentUser.username}`}>
            
            {/* ESTA É A CORREÇÃO PRINCIPAL: Um Flexbox horizontal */}
            <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#eef5fb' }}>
              
              {/* COLUNA ESQUERDA (Tamanho fixo) */}
              <div style={{ 
                width: '280px', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRight: '1px solid #a5c3d9' 
              }}>
                <UserProfile user={currentUser} />
                <ContactList contacts={contacts} onSelectContact={setActiveContact} />
              </div>

              {/* COLUNA DIREITA (Área de Chat - Ocupa o resto) */}
              <div style={{ flex: 1, height: '100%', backgroundColor: 'white', position: 'relative' }}>
                {activeContact ? (
                  <ChatWindow activeContact={activeContact} currentUser={currentUser} />
                ) : (
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', h: '100%', padding: '40px', gap: '20px' 
                  }}>
                    <img src="/images/logo-msn.png" style={{ width: '120px', opacity: '0.3' }} />
                    <p style={{ color: '#235d81', fontSize: '13px', textAlign: 'center' }}>
                      Selecione um delegado na lista ao lado para conversar
                    </p>
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
