'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trips, Trip } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import TransportIcon from './TransportIcon';

// Function to create a simple colored dot marker
function createColoredMarkerIcon(color: string): L.DivIcon {
  const svgIcon = `
    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="5" fill="none" stroke="${color}" stroke-width="2"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-dot',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
}

// Component to fit map bounds to selected trip
function MapBounds({ trip }: { trip: Trip | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (trip && trip.locations.length > 0) {
      const bounds = L.latLngBounds(
        trip.locations.map(loc => [loc.lat, loc.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Show all trips
      const allLocations: [number, number][] = [];
      trips.forEach(t => {
        t.locations.forEach(loc => {
          allLocations.push([loc.lat, loc.lng]);
        });
      });
      
      if (allLocations.length > 0) {
        const bounds = L.latLngBounds(allLocations);
        map.fitBounds(bounds, { padding: [20, 20] });
      } else {
        map.setView([50.0, 10.0], 3);
      }
    }
  }, [trip, map]);

  return null;
}

export default function TravelMapPreview() {
  const { language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Ensure Leaflet CSS is loaded
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      if (!document.head.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) {
        document.head.appendChild(link);
      }
    }
  }, []);

  // Get all trips sorted by year (newest first)
  const sortedTrips = [...trips].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  // Get route coordinates for a trip
  const getRouteCoordinates = (trip: Trip): [number, number][] => {
    return trip.locations.map(loc => [loc.lat, loc.lng]);
  };

  // Default center (Europe)
  const center: [number, number] = [50.0, 10.0];
  const zoom = 3;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row h-[500px] md:h-[600px] overflow-hidden">
          {/* Left Sidebar - Trip List */}
          <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto bg-gray-50 h-[250px] md:h-auto">
            <div className="p-3 md:p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h2 className="text-base md:text-xl font-bold text-gray-900">
                {language === 'zh' ? '所有旅程' : 'All Trips By Chinghua Ivy Lu'}
              </h2>
            </div>
            
            {selectedTrip ? (
              // Selected Trip Details View
              <div className="p-3 md:p-4">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  ← {language === 'zh' ? '返回所有旅程' : 'Back to all trips'}
                </button>
                
                <div className="mb-3 md:mb-4">
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">{selectedTrip.title}</h3>
                  {selectedTrip.distance && (
                    <p className="text-sm text-gray-600 mb-2">{selectedTrip.distance}</p>
                  )}
                  {selectedTrip.description && (
                    <p className="text-sm text-gray-600">{selectedTrip.description}</p>
                  )}
                </div>

                <div className="space-y-0">
                  {selectedTrip.locations.map((location, index) => {
                    const isLast = index === selectedTrip.locations.length - 1;
                    const tripColor = selectedTrip.color || "#3b82f6";
                    
                    return (
                      <div key={location.id} className="flex items-start gap-2 md:gap-3 py-2 md:py-3 px-2 border-b border-gray-200 last:border-b-0">
                        {/* Icon area */}
                        <div className="flex-shrink-0 flex flex-col items-center relative">
                          {index > 0 && (
                            <div 
                              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5"
                              style={{ 
                                backgroundColor: tripColor,
                                height: '50%'
                              }}
                            />
                          )}
                          
                          <div 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative z-10"
                            style={{ backgroundColor: tripColor }}
                          >
                            {index > 0 && (
                              <div className="flex items-center justify-center w-full h-full">
                                <TransportIcon mode={location.transportMode} className="w-4 h-4 md:w-5 md:h-5" />
                              </div>
                            )}
                          </div>
                          
                          {!isLast && (
                            <div 
                              className="absolute top-8 md:top-10 left-1/2 transform -translate-x-1/2 w-0.5"
                              style={{ 
                                backgroundColor: tripColor,
                                height: '50%'
                              }}
                            />
                          )}
                        </div>
                        
                        {/* Location info */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="mb-0.5">
                            {location.link ? (
                              <Link 
                                href={location.link}
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {location.name}
                              </Link>
                            ) : (
                              <span className="font-semibold text-gray-900">{location.name}</span>
                            )}
                          </div>
                          {location.date && (
                            <p className="text-xs text-gray-500">{location.date}</p>
                          )}
                          {location.description && (
                            <p className="text-xs text-gray-600 mt-1">{location.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // All Trips List View
              <div className="divide-y divide-gray-200">
                {sortedTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className="w-full p-4 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 group"
                  >
                    <div
                      className="w-1 h-12 md:h-16 rounded-full flex-shrink-0"
                      style={{ backgroundColor: trip.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                        {trip.title}
                      </h3>
                      {trip.distance && (
                        <p className="text-xs text-gray-500 mt-1">{trip.distance}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Map */}
          {isMounted && (
            <div className="flex-1 relative h-[250px] md:h-auto min-h-[250px]">
              <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapBounds trip={selectedTrip} />

                {/* Show all trips or selected trip */}
                {(selectedTrip ? [selectedTrip] : sortedTrips).map((trip) => {
                  const routeCoords = getRouteCoordinates(trip);
                  
                  return (
                    <div key={trip.id}>
                      {/* Draw route line */}
                      {routeCoords.length > 1 && (
                        <Polyline
                          positions={routeCoords}
                          pathOptions={{
                            color: trip.color,
                            weight: selectedTrip?.id === trip.id ? 2 : 1,
                            opacity: selectedTrip?.id === trip.id ? 0.8 : 0.4,
                          }}
                        />
                      )}
                      
                      {/* Draw markers */}
                      {trip.locations.map((location) => (
                        <Marker
                          key={`${trip.id}-${location.id}`}
                          position={[location.lat, location.lng]}
                          icon={createColoredMarkerIcon(trip.color)}
                        >
                          <Popup>
                            <div className="p-2">
                              <div className="flex items-center gap-2 mb-1">
                                {trip.locations[0].id !== location.id && (
                                  <TransportIcon mode={location.transportMode} className="w-5 h-5" />
                                )}
                                {location.link ? (
                                  <Link href={location.link} className="font-bold text-lg text-blue-600 hover:text-blue-800">
                                    {location.name}
                                  </Link>
                                ) : (
                                  <h3 className="font-bold text-lg">{location.name}</h3>
                                )}
                              </div>
                              {location.date && (
                                <p className="text-sm text-gray-600">{location.date}</p>
                              )}
                              {location.description && (
                                <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">{trip.title}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </div>
                  );
                })}
              </MapContainer>
            </div>
          )}
          {!isMounted && (
            <div className="flex-1 bg-gray-100 flex items-center justify-center h-[250px] md:h-auto min-h-[250px]">
              <div className="text-gray-500">{language === 'zh' ? '載入地圖中...' : 'Loading map...'}</div>
            </div>
          )}
        </div>
    </div>
  );
}

