import React from 'react';

const StudioLocationMap = () => {
  // Replace this with your actual studio address or coordinates
  const studioAddress = "Butuan City, Agusan Del Norte, Philippines";
  const encodedAddress = encodeURIComponent(studioAddress);
  
  return (
    <div className="w-full h-[450px] rounded-[2rem] overflow-hidden border-4 border-black/5 shadow-2xl relative group">
      {/* Premium Overlay for Glassmorphism look */}
      <div className="absolute top-8 left-8 z-10 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-xs animate-fadeIn">
        <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em] mb-2">Visit Lightworks</p>
        <h3 className="text-xl font-serif text-black mb-3">Our Main Studio</h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          Experience our world-class lighting setup in the heart of Butuan City. 
        </p>
        <button 
          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank')}
          className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#E8734A] transition-all flex items-center justify-center gap-2"
        >
          <span>Get Directions</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
        </button>
      </div>

      {/* Google Maps Embed API (Free) */}
      <iframe
        title="Lightworks Studio Location"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_KEY_NOT_NEEDED_FOR_EMBED_IFRAME_BUT_WE_USE_SEARCH_VERSION&q=${encodedAddress}`}
        // Using the public search embed URL which is fully free and requires no key
        src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
      ></iframe>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default StudioLocationMap;
