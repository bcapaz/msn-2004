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

  // SE NÃO FOR ADMIN, ABRE O MSN NORMAL
  return (
    <>
      <Head>
        <title>{currentUser.display_name || currentUser.username} - MSN</title>
      </Head>

      {/* AQUI ESTÁ A CORREÇÃO DA PÁGINA: 
        1. minHeight: '100vh' (Garante que o fundo azul preencha a tela toda)
        2. padding: '40px 20px' (Dá um respiro em cima e embaixo, liberando o scroll)
        3. Removemos o overflow: 'hidden' que travava a rolagem 
      */}
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', /* Muda de center para flex-start para não cortar o topo */
        backgroundColor: '#86b9e0',
        padding: '40px 20px' 
      }}>
        
        <div style={{ width: '950px', height: '650px' }}>
          <WindowFrame title={`Windows Live Messenger - ${currentUser.display_name || currentUser.username}`}>
            <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#eef5fb' }}>
              
              <div style={{ width: '280px', height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #a5c3d9' }}>
                <UserProfile user={currentUser} />
                <ContactList contacts={contacts} onSelectContact={setActiveContact} />
              </div>

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
