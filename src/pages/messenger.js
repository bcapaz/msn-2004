import { useState, useEffect } from 'react';
import UserProfile from '../components/msn/UserProfile';
import ContactList from '../components/msn/ContactList';
import ChatWindow from '../components/msn/ChatWindow';
import WindowFrame from '../components/ui/WindowFrame';

export default function Messenger() {
  const [me, setMe] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);

  // Carrega dados iniciais do usuário logado (simulado via localStorage do Login)
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setMe(savedUser);
    fetchContacts();
  }, []);

  // Busca lista de contatos
  const fetchContacts = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setContacts(data.filter(c => c.id !== me?.id));
  };

  // Polling para mensagens novas a cada 3 segundos
  useEffect(() => {
    if (!activeContact || !me) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/messages?sId=${me.id}&rId=${activeContact.id}`);
      const data = await res.json();
      setMessages(data.map(m => ({
        ...m,
        isMe: m.senderId === me.id,
        senderName: m.senderId === me.id ? me.display_name : activeContact.display_name
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeContact, me]);

  const handleSendMessage = async (content) => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: me.id, receiverId: activeContact.id, content })
    });
    // Atualiza localmente para ser instantâneo
    setMessages([...messages, { content, isMe: true, senderName: me.display_name }]);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 bg-[#86b9e0]">
      <div className="w-[800px] h-[600px] flex gap-4">
        {/* Janela da Lista de Contatos */}
        <div className="w-1/3">
          <WindowFrame title="Windows Live Messenger">
            <UserProfile user={me} />
            <ContactList contacts={contacts} onSelectContact={setActiveContact} />
          </WindowFrame>
        </div>

        {/* Janela de Chat Ativo */}
        <div className="w-2/3">
          {activeContact ? (
            <WindowFrame title={`${activeContact.display_name} - Conversa`}>
              <ChatWindow 
                activeContact={activeContact} 
                messages={messages} 
                onSendMessage={handleSendMessage}
                onSendNudge={() => alert('TRUUUM! (Tela tremendo)')}
              />
            </WindowFrame>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/50 rounded-lg text-white font-bold italic">
              Selecione um delegado para iniciar a trama...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
