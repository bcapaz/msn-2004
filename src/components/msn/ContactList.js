import React from 'react';

export default function ContactList({ contacts, onSelectContact }) {
  const online = contacts.filter(c => c.status !== 'offline');
  const offline = contacts.filter(c => c.status === 'offline');

  const ContactItem = ({ contact }) => (
    <div 
      onClick={() => onSelectContact(contact)}
      className="flex items-center gap-2 px-2 py-1 hover:bg-[#cfe4f3] cursor-pointer group"
    >
      <img 
        src={`/images/status-${contact.status}.png`} 
        className="w-4 h-4" 
        alt={contact.status} 
      />
      <span className="text-sm group-hover:underline text-[#235d81]">
        {contact.display_name} - <span className="text-gray-500 italic text-xs">{contact.subnick}</span>
      </span>
    </div>
  );

  return (
    <div className="bg-white border-l border-r border-gray-300 h-full overflow-y-auto custom-scrollbar">
      <div className="bg-[#eef5fb] px-2 py-1 text-xs font-bold text-gray-600 border-b border-gray-200">
        Online ({online.length})
      </div>
      {online.map(c => <ContactItem key={c.id} contact={c} />)}

      <div className="bg-[#eef5fb] px-2 py-1 text-xs font-bold text-gray-600 border-b border-t border-gray-200 mt-2">
        Offline ({offline.length})
      </div>
      {offline.map(c => <ContactItem key={c.id} contact={c} />)}
    </div>
  );
}
