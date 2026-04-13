import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
        .then(data => setContacts(data.filter(u => u.id !== currentUser.id)))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex',
      alignItems: 'center', justifyContent: 'center', backgroundColor: '#86b9e0'
    }}>
      {/* Janela Principal com tamanho fixo e flex */}
      <div style={{ width: '900px', height: '650px', display: 'flex' }}>
        <WindowFrame title={`Windows Live Messenger - ${currentUser.display_name || currentUser.username}`}>
          
          <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#eef5fb' }}>
            
            {/* COLUNA DA ESQUERDA (Perfil + Contatos) */}
            <div style={{ 
              width: '280px', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRight: '1px solid #a5c3d9',
              height: '100%' 
            }}>
              <UserProfile user={currentUser} />
              <ContactList contacts={contacts} onSelectContact={setActiveContact} />
            </div>

            {/* COLUNA DA DIREITA (Área de Chat) */}
            <div style={{ flex: 1, height: '100%', backgroundColor: 'white', position: 'relative' }}>
              {activeContact ? (
                <ChatWindow activeContact={activeContact} currentUser={currentUser} />
              ) : (
                <div style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  justifyContent: 'center', height: '100%', padding: '40px' 
                }}>
                  <img src="/images/logo-msn.png" style={{ width: '120px', opacity: '0.3', marginBottom: '20px' }} />
                  {/* FRASE ATUALIZADA AQUI */}
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
  );
}
