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
    if (currentUser) {
      fetch('/api/users/list')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Filtra para não mostrar você mesmo e não mostrar Admins
            const otherDelegates = data.filter(u => u.id !== currentUser.id && !u.isAdmin);
            setContacts(otherDelegates);
          }
        })
        .catch(err => console.error("Erro ao buscar delegados:", err));
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <>
      <Head>
        <title>{currentUser.display_name || currentUser.username} - MSN</title>
      </Head>

      <div style={{
        height: '100vh', width: '100vw', display: 'flex',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#86b9e0'
      }}>
        
        {/* Janela com tamanho ABSOLUTAMENTE FIXO */}
        <div style={{ width: '950px', height: '650px' }}>
          <WindowFrame title={`Windows Live Messenger - ${currentUser.display_name || currentUser.username}`}>
            
            <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#eef5fb' }}>
              
              {/* COLUNA ESQUERDA: Fixa em 280px */}
              <div style={{ 
                width: '280px', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRight: '1px solid #a5c3d9' 
              }}>
                <UserProfile user={currentUser} />
                <ContactList 
                  contacts={contacts} 
                  onSelectContact={setActiveContact} 
                />
              </div>

              {/* COLUNA DIREITA: Área de Chat ocupando o resto */}
              <div style={{ flex: 1, height: '100%', backgroundColor: 'white', overflow: 'hidden' }}>
                {activeContact ? (
                  <ChatWindow activeContact={activeContact} currentUser={currentUser} />
                ) : (
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', height: '100%', gap: '20px' 
                  }}>
                    <img src="/images/logo-msn.png" style={{ width: '100px', opacity: '0.2' }} />
                    <p style={{ color: '#235d81', fontSize: '13px' }}>
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
