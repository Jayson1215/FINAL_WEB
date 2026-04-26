import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_CENTER = [125.5439, 8.9492]; // Note: MapLibre uses [lng, lat]

const MAP_LAYERS = {
  standard: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  dark: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

function parseCoordinates(text) {
  if (!text) return null;
  const match = String(text).match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return [parseFloat(match[2]), parseFloat(match[1])]; // [lng, lat] for MapLibre
}

export default function LocationPickerMap({ locationText, onLocationSelect, height = '150px', minimal = false }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [resolving, setResolving] = useState(false);
  const [activeLayer, setActiveLayer] = useState('dark');
  const [isExpanded, setIsExpanded] = useState(false);
  const [resolvedAddr, setResolvedAddr] = useState('');
  const [isMapDriven, setIsMapDriven] = useState(false);
  const [searchText, setSearchText] = useState(locationText || '');
  const searchTimeout = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (map.current) return;

    const initialPos = parseCoordinates(locationText) || DEFAULT_CENTER;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'google-tiles': {
            type: 'raster',
            tiles: [MAP_LAYERS[activeLayer]],
            tileSize: 256,
            attribution: '&copy; Google'
          }
        },
        layers: [
          {
            id: 'google-tiles',
            type: 'raster',
            source: 'google-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: initialPos,
      zoom: locationText ? 17 : 12,
      attributionControl: false
    });

    map.current.on('load', () => {
      map.current.resize();
    });

    // Custom Marker
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-black/20 rounded-full animate-ping"></div>
        <div class="relative w-4 h-4 bg-black border-2 border-white rounded-full shadow-lg"></div>
      </div>
    `;

    marker.current = new maplibregl.Marker({ element: el })
      .setLngLat(initialPos)
      .addTo(map.current);

    map.current.on('load', () => {
      map.current.resize();
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      handleMapAction(lng, lat);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Force resize for minimal/modal instances
  useEffect(() => {
    if (minimal && map.current) {
      const timer = setTimeout(() => {
        map.current.resize();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [minimal, isExpanded]);

  // Sync Layer
  useEffect(() => {
    if (!map.current) return;
    const source = map.current.getSource('google-tiles');
    if (source) {
      map.current.removeLayer('google-tiles');
      map.current.removeSource('google-tiles');
      map.current.addSource('google-tiles', {
        type: 'raster',
        tiles: [MAP_LAYERS[activeLayer]],
        tileSize: 256,
        attribution: '&copy; Google'
      });
      map.current.addLayer({
        id: 'google-tiles',
        type: 'raster',
        source: 'google-tiles',
        minzoom: 0,
        maxzoom: 22
      });
    }
  }, [activeLayer]);

  // Sync Position from External Text
  useEffect(() => {
    const parsed = parseCoordinates(locationText);
    if (parsed && map.current && marker.current && !isMapDriven) {
      map.current.flyTo({ center: parsed, zoom: 17, speed: 1.5 });
      marker.current.setLngLat(parsed);
    }
    setSearchText(locationText || '');
    setIsMapDriven(false);
  }, [locationText]);

  const reverseGeocode = useCallback(async (lng, lat) => {
    try {
      // Switching to ArcGIS Professional Geocoding for higher subdivision/POI accuracy
      const res = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=${lng},${lat}`);
      const data = await res.json();
      
      if (data.address) {
        const a = data.address;
        // ArcGIS provides very detailed LongLabels and specific address parts
        // Order: Neighborhood/Subdivision -> Street Address -> City
        const components = [];
        
        // Priority: Place Name or Neighborhood (Subdivision)
        if (a.PlaceName || a.Neighborhood) components.push(a.PlaceName || a.Neighborhood);
        if (a.Address) components.push(a.Address);
        if (a.City) components.push(a.City);
        
        const result = components.length > 0 ? components.join(', ') : a.LongLabel;
        setResolvedAddr(result);
        return result;
      }
      return '';
    } catch (e) { 
      console.error('Geocoding failed:', e);
      return ''; 
    }
  }, []);

  const handleMapAction = useCallback(async (lng, lat) => {
    setIsMapDriven(true);
    if (marker.current) marker.current.setLngLat([lng, lat]);
    if (map.current) map.current.flyTo({ center: [lng, lat], speed: 1.2 });
    
    setResolving(true);
    const address = await reverseGeocode(lng, lat);
    setResolving(false);

    // Smart Merge Logic: Keep existing specific details (Block, Lot, Phase, etc.)
    const currentText = locationText || '';
    const specifics = currentText.match(/.*(Block|Lot|Blk|Phase|Unit|Room|House|#).*/i);
    const specificPart = specifics ? currentText : '';
    
    // If the new address already contains the subdivision name (like Emily Homes), 
    // don't repeat it if the user already typed it.
    const finalAddress = specificPart 
      ? (specificPart.toLowerCase().includes(address.toLowerCase()) ? specificPart : `${specificPart}, ${address}`)
      : address;

    setSearchText(finalAddress);

    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: finalAddress });
    }
  }, [onLocationSelect, reverseGeocode, locationText]);

  const handlePlaceSearch = useCallback(async () => {
    const query = searchText.trim();
    if (!query) return;
    try {
      const res = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(query)}&maxLocations=1`);
      const data = await res.json();
      if (data.candidates?.[0]) {
        const { x: lng, y: lat } = data.candidates[0].location;
        await handleMapAction(lng, lat);
      } else if (onLocationSelect) {
        onLocationSelect({ lat: null, lng: null, address: query });
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  }, [searchText, handleMapAction, onLocationSelect]);

  const handleUseCurrent = useCallback(() => {
    if (!navigator.geolocation) return;
    setResolving(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        await handleMapAction(lng, lat);
      },
      () => setResolving(false),
      { enableHighAccuracy: true }
    );
  }, [handleMapAction]);

  if (minimal) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
        <div className="absolute top-6 right-6 z-30 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUseCurrent}
            className="w-10 h-10 rounded-xl bg-[#E8734A] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all border border-white/20 mb-2"
            title="Pin My Location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
          
          {Object.entries(MAP_LAYERS).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveLayer(key)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all shadow-2xl backdrop-blur-xl border ${activeLayer === key ? 'bg-black text-white border-black' : 'bg-white/90 text-black border-black/5 hover:bg-white'}`}
            >
              {key === 'standard' ? '🗺️' : key === 'satellite' ? '🛰️' : '🌙'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 group/map">
        {!minimal && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${resolving ? 'bg-[#E8734A] animate-ping' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
               <p className="text-[8px] font-bold uppercase tracking-widest text-black opacity-30">
                 {resolving ? 'Syncing MapLibre' : 'Vector Engine Active'}
               </p>
            </div>
            <div className="flex gap-4 items-center">
                <button type="button" onClick={handleUseCurrent} className="text-[8px] font-bold text-[#E8734A] uppercase tracking-widest hover:opacity-70 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8734A]"></span>
                  Pin My Location
                </button>
                <button type="button" onClick={() => setIsExpanded(true)} className="text-[8px] font-bold text-black opacity-40 uppercase tracking-widest hover:opacity-100 transition flex items-center gap-1.5 group/expand">
                   <span>Full Screen</span>
                   <svg className="w-2.5 h-2.5 group-hover/expand:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                </button>
            </div>
          </div>
        )}

        <div className={`${minimal ? 'h-full' : 'overflow-hidden rounded-2xl border-2 border-black/5 shadow-2xl'} relative z-10`} style={minimal ? {} : { height }}>
          <div ref={mapContainer} className="w-full h-full" />

          <div className="absolute top-4 left-4 right-20 z-30">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search place, street, barangay, landmark"
                className="w-full bg-white/95 backdrop-blur-xl border border-black/10 rounded-xl px-4 py-2.5 text-[9px] font-bold tracking-wide outline-none focus:bg-white focus:border-black/30 transition-all"
                value={searchText}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchText(value);
                  if (onLocationSelect) {
                    onLocationSelect({ lat: null, lng: null, address: value });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePlaceSearch();
                  }
                }}
              />
              <button
                type="button"
                onClick={handlePlaceSearch}
                className="px-3 py-2.5 rounded-xl bg-black text-white text-[8px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="absolute top-6 right-6 z-30 flex flex-col gap-3">
            {Object.entries(MAP_LAYERS).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveLayer(key)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all shadow-2xl backdrop-blur-xl border ${activeLayer === key ? 'bg-black text-white border-black' : 'bg-white/90 text-black border-black/5 hover:bg-white'}`}
              >
                {key === 'standard' ? '🗺️' : key === 'satellite' ? '🛰️' : '🌙'}
              </button>
            ))}
          </div>
        </div>

        {!minimal && (
          <p className="text-[7px] font-bold text-black opacity-30 uppercase tracking-widest italic text-center leading-relaxed">
              Note: MapLibre high-speed vector engine enabled.
          </p>
        )}
      </div>

      {/* Pop-up Modal - Full Precision Map - Portaled to Body to avoid container clipping */}
      {isExpanded && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white w-[95vw] h-[90vh] rounded-[3rem] shadow-2xl border border-black/10 overflow-hidden relative animate-modalPop flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white z-20">
               <div className="space-y-1">
                  <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Precision Targeting</p>
                  <h3 className="text-xl font-serif text-black">Select Venue Destination</h3>
               </div>
               <button onClick={() => setIsExpanded(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-black border border-black/5 hover:bg-black hover:text-white transition-all">
                  <span className="text-2xl leading-none">&times;</span>
               </button>
            </div>

            {/* Modal Map Body */}
            <div className="flex-1 relative bg-black">
                <LocationPickerMap height="100%" locationText={locationText} onLocationSelect={onLocationSelect} minimal={true} />
               
               <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[11000] w-full px-6 flex justify-center pointer-events-none">
                  <button onClick={() => setIsExpanded(false)} className="pointer-events-auto bg-black text-white px-16 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] hover:bg-[#E8734A] transition-all border border-white/10 active:scale-95 flex items-center gap-4 group">
                     <span>Secure Venue Location</span>
                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </button>
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalPop { animation: modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .custom-marker { cursor: pointer; }
      `}</style>
    </>
  );
}
