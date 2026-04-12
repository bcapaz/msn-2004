import React from 'react';

export default function ContactList({ contacts, onSelectContact }) {
  return (
    <div className="bg-white border-l border-r border-gray-300 h-full overflow-y-auto custom-scrollbar">
      <div className="bg-[#eef5fb] px-2 py-1 text-xs font-bold text-gray-600 border-b border-gray-200">
        Delegados ({contacts.length})
      </div>
      {contacts.map(contact => (
        <div 
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-[#cfe4f3] cursor-pointer border-b border-gray-100"
        >
          {/* Mostra o avatar minúsculo do contato na lista */}
          <img src={contact.avatar_url || "/images/default-avatar.png"} className="w-5 h-5" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-[#235d81] truncate">{contact.display_name || contact.username}</span>
            <span className="text-[10px] text-gray-500 italic truncate">{contact.subnick}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
