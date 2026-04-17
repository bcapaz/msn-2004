import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import WindowFrame from '../components/ui/WindowFrame';
import UserProfile from '../components/msn/UserProfile';
import ContactList from '../components/msn/ContactList';
import ChatWindow from '../components/msn/ChatWindow';
import SpyPanel from '../components/admin/SpyPanel'; // Novo componente que vamos criar!

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
      // Busca contatos apenas se NÃO for admin
      fetch('/api/users/list')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const otherDelegates = data.filter(u => u.id !== currentUser.id && !u.isAdmin);
            setContacts(otherDelegates);
          }
        })
        .catch(err => console.error("Erro ao buscar delegados"));
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // ===== A MÁGICA ACONTECE AQUI =====
  if (currentUser.isAdmin) {
    return (
      <>
        <Head><title>Painel da Direção - Modo Espião</title></Head>
        <SpyPanel currentUser={currentUser} />
      </>
    );
  }
  // ==================================

  // Se não for Admin, renderiza o MSN normal:
  return (
    <>
      <Head>
        <title>{currentUser.display_name || currentUser.username} - MSN</title>
      </Head>

      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#86b9e0' }}>
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
                    <p style={{ color: '#235d81', fontSize: '13px' }}>Selecione um delegado na lista ao lado para conversar</p>
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
