import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const DEFAULT_CENTER = { lat: 8.9492, lng: 125.5439 };

function parseCoordinates(text) {
  if (!text) return null;
  const match = String(text).match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
}

export default function LocationPickerMap({ locationText, onLocationSelect, height = '220px' }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [markerPosition, setMarkerPosition] = useState(() => parseCoordinates(locationText));
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  const mapContainerStyle = useMemo(() => ({ width: '100%', height }), [height]);

  useEffect(() => {
    const parsed = parseCoordinates(locationText);
    if (parsed) {
      setMarkerPosition(parsed);
    }
  }, [locationText]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'client-location-picker-map',
    googleMapsApiKey: apiKey,
  });

  const reverseGeocode = useCallback(async (lat, lng) => {
    if (!window.google?.maps?.Geocoder) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]?.formatted_address) {
          resolve(results[0].formatted_address);
          return;
        }
        resolve(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });
    });
  }, []);

  const applyLocation = useCallback(async (lat, lng) => {
    setMarkerPosition({ lat, lng });
    if (mapRef) {
      mapRef.panTo({ lat, lng });
    }

    setResolvingAddress(true);
    const address = await reverseGeocode(lat, lng);
    setResolvingAddress(false);

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address,
      });
    }
  }, [mapRef, onLocationSelect, reverseGeocode]);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();

    if (typeof lat !== 'number' || typeof lng !== 'number') return;
    void applyLocation(lat, lng);
  }, [applyLocation]);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    setResolvingAddress(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await applyLocation(lat, lng);
      },
      () => {
        setResolvingAddress(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [applyLocation]);

  if (!apiKey) {
    return (
      <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Map Unavailable</p>
        <p className="text-xs text-[#64748B]">Set VITE_GOOGLE_MAPS_API_KEY to enable Google Map pin selection.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-4">
        <p className="text-xs text-red-600">Failed to load Google Map. You can still type the event location manually.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white h-[220px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#CBD5E1] border-t-[#E8734A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">Pin Event Location</p>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="text-[10px] font-semibold text-[#E8734A] hover:opacity-70 transition"
        >
          Use My Location
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] shadow-sm">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition || DEFAULT_CENTER}
          zoom={markerPosition ? 16 : 12}
          onClick={handleMapClick}
          onLoad={(map) => setMapRef(map)}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {markerPosition && <MarkerF position={markerPosition} />}
        </GoogleMap>
      </div>

      <p className="text-[10px] text-[#64748B]">
        {resolvingAddress ? 'Resolving address from pin...' : 'Tap on the map to pin the exact event location.'}
      </p>
    </div>
  );
}
