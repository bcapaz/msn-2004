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

  // 1. Verificação de Sessão (Só entra quem está logado)
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      router.push('/');
    } else {
      setCurrentUser(JSON.parse(loggedUser));
    }
  }, [router]);

  // 2. Busca a lista de contatos (outras delegações)
  useEffect(() => {
    if (currentUser) {
      const fetchContacts = async () => {
        try {
          const res = await fetch('/api/users/list');
          if (res.ok) {
            const data = await res.json();
            // Filtra para não mostrar o próprio usuário na lista
            setContacts(data.filter(u => u.id !== currentUser.id));
          }
        } catch (error) {
          console.error("Erro ao carregar contatos:", error);
        }
      };
      fetchContacts();
    }
  }, [currentUser]);

  if (!currentUser) return null; // Aguarda o carregamento

  return (
    <>
      <Head>
        <title>{currentUser.display_name || currentUser.username} - Windows Live Messenger</title>
      </Head>

      <div className="h-screen w-screen flex items-center justify-center bg-[#86b9e0] overflow-hidden">
        {/* Janela Principal do MSN (Tamanho clássico) */}
        <div className="w-[850px] h-[650px] shadow-2xl relative">
          <WindowFrame title={`Windows Live Messenger - ${currentUser.display_name || currentUser.username}`}>
            
            <div className="flex h-full w-full bg-[#eef5fb]">
              
              {/* Lado Esquerdo: Perfil + Lista de Contatos */}
              <div className="w-[280px] h-full flex flex-col border-r border-gray-300">
                <UserProfile user={currentUser} />
                <ContactList 
                  contacts={contacts} 
                  onSelectContact={setActiveContact} 
                />
              </div>

              {/* Lado Direito: Área de Chat */}
              <div className="flex-1 h-full bg-white relative">
                {activeContact ? (
                  <ChatWindow activeContact={activeContact} currentUser={currentUser} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-4 bg-[#f3f9ff]">
                    <img src="/images/logo-msn.png" className="w-20 opacity-40" />
                    <p className="text-gray-500 text-sm">
                      Selecione um delegado na lista ao lado para iniciar a trama diplomática...
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
