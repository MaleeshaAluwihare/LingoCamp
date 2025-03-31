// MessagingPage.js
import React, { useState } from 'react';

const Messaging = () => {
  // Sample contacts data
  const contacts = [
    { id: 1, name: "Sarah Johnson", avatar: "S", lastMessage: "Thanks for the information!", time: "10:30 AM", unread: 2 },
    { id: 2, name: "Michael Chen", avatar: "M", lastMessage: "When can we schedule the interview?", time: "Yesterday", unread: 0 },
    { id: 3, name: "David Wilson", avatar: "D", lastMessage: "The documents have been sent", time: "Monday", unread: 1 },
  ];

  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Sarah Johnson", text: "Hello there!", time: "10:20 AM", isMe: false },
    { id: 2, sender: "Me", text: "Hi Sarah! How can I help you?", time: "10:22 AM", isMe: true },
    { id: 3, sender: "Sarah Johnson", text: "Thanks for the information!", time: "10:30 AM", isMe: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "Me",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex h-[600px]">
          {/* Contacts sidebar */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <input 
                type="text" 
                placeholder="Search messages" 
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeContact.id === contact.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold text-blue-600">{contact.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{contact.name}</h3>
                      <span className="text-xs text-gray-500">{contact.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="w-2/3 flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="font-bold text-blue-600">{activeContact.avatar}</span>
              </div>
              <div>
                <h3 className="font-medium">{activeContact.name}</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isMe ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
                    >
                      {!message.isMe && (
                        <p className="text-xs font-medium text-gray-500">{message.sender}</p>
                      )}
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 text-right ${message.isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;