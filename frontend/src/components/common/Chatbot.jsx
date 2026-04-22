import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am your LIGHT Photography assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqs = [
    { keywords: ['package', 'price', 'offer'], response: 'We offer several photography packages including Portraits, Events, and Editorial sessions. You can view all our packages in the "Packages" section.' },
    { keywords: ['book', 'reservation', 'how'], response: 'To book a session, simply browse our Packages, select the one you like, and fill out the booking request form with your preferred date, time, and event location.' },
    { keywords: ['location', 'where', 'studio'], response: 'We are a purely on-call photography service! We don\'t have a physical studio for sessions. We travel to your chosen event location to capture your special moments.' },
    { keywords: ['status', 'pending', 'approved'], response: 'Once you submit a booking request, its status will be "Pending". Our team will review it and either "Approve" or "Reject" it based on availability. You can track this in "My Bookings".' },
    { keywords: ['contact', 'help', 'support'], response: 'You can reach us through our Contact page or via email at concierge@lightstudio.com for any specific inquiries.' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const lowercaseInput = input.toLowerCase();
    let botResponse = "I'm not sure I understand. Could you please rephrase that or check our Packages section?";

    for (const faq of faqs) {
      if (faq.keywords.some(keyword => lowercaseInput.includes(keyword))) {
        botResponse = faq.response;
        break;
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 600);

    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-[#F1F5F9] overflow-hidden flex flex-col mb-4 animate-slideIn h-[500px]">
          {/* Header */}
          <div className="bg-[#1E293B] p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8734A] mb-1">Live Assistant</p>
              <h3 className="text-lg font-serif">LIGHT Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F9FB]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  msg.type === 'user' 
                    ? 'bg-[#E8734A] text-white rounded-tr-none' 
                    : 'bg-white text-[#1E293B] shadow-sm border border-[#F1F5F9] rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[#F1F5F9] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-[#F8F9FB] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E8734A]/20 outline-none"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-[#1E293B] text-white rounded-xl flex items-center justify-center hover:bg-[#E8734A] transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-[#1E293B] text-white rotate-90' : 'bg-[#E8734A] text-white'
        }`}
      >
        {isOpen ? '✕' : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
