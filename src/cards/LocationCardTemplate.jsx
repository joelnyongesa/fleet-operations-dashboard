import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { routes, MOCK_PROGRESS } from '../utils/data';

// --- Configuration ---
const MAP_CENTER = { lat: -1.286389, lng: 36.817223 }; // Approx Nairobi CBD
const MAP_ZOOM = 11;

const busIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30px" height="30px">
  <path d="M18.9 2.11a1.5 1.5 0 0 0-1.31.76L16.15 5H7.85L6.41 2.87a1.5 1.5 0 0 0-2.59 1.51L5.2 7.13a3.5 3.5 0 0 0-1.7 2.99V15.5A3.5 3.5 0 0 0 7 19h10a3.5 3.5 0 0 0 3.5-3.5V10.12a3.5 3.5 0 0 0-1.7-2.99l1.38-2.75a1.5 1.5 0 0 0-1.28-2.27ZM8.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM5.17 9l-.63-1.25h14.92L18.83 9H5.17Z"/>
</svg>
`;
const encodedBusIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(busIconSvg)}`;


// --- Component ---
function LocationCardTemplate() {

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAPS_API_KEY || "",
        libraries: ['places', 'geometry'],
    });

    const [directions, setDirections] = useState({});
    const [busPositions, setBusPositions] = useState({});
    const [activeMarker, setActiveMarker] = useState(null);

    const mapRef = useRef(null);
    const directionsServiceRef = useRef(null);

    const busMarkerIcon = useMemo(() => {
        if (!isLoaded) return null; 
        return {
            url: encodedBusIcon,
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
        };
    }, [isLoaded]);


    const getPointAlongPath = useCallback((path, fraction) => {
        if (!isLoaded || !window.google?.maps?.geometry?.spherical || !path || path.length < 2) {
             console.warn("Geometry library not loaded or path invalid for getPointAlongPath");
             return null;
         }

        const totalDistance = window.google.maps.geometry.spherical.computeLength(path);
        if (totalDistance === 0) return path[0];

        const targetDistance = totalDistance * fraction;
        let accumulatedDistance = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const legStart = path[i];
            const legEnd = path[i + 1];
            const legDistance = window.google.maps.geometry.spherical.computeDistanceBetween(legStart, legEnd);

            if (isNaN(legDistance) || legDistance <= 0) continue;

            if (accumulatedDistance + legDistance >= targetDistance) {
                const remainingDistance = targetDistance - accumulatedDistance;
                const legFraction = remainingDistance / legDistance;

                const clampedFraction = Math.max(0, Math.min(1, legFraction));

                return window.google.maps.geometry.spherical.interpolate(legStart, legEnd, clampedFraction);
            }
            accumulatedDistance += legDistance;
        }
        return path[path.length - 1];
    }, [isLoaded]);

    useEffect(() => {
        if (!isLoaded || !window.google || directionsServiceRef.current) return;

        directionsServiceRef.current = new window.google.maps.DirectionsService();
        const service = directionsServiceRef.current;
        const newDirections = {};
        const newBusPositions = {};
        let routesProcessed = 0;

        routes.forEach(route => {
            service.route(
                {
                    origin: route.origin,
                    destination: route.destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    drivingOptions: {
                        departureTime: new Date(),
                        trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
                    },
                },
                (result, status) => {
                    routesProcessed++;
                    if (status === window.google.maps.DirectionsStatus.OK && result) {
                        newDirections[route.id] = result;

                        const path = result.routes[0]?.overview_path;
                        const progress = MOCK_PROGRESS[route.id] || 0;
                        const position = getPointAlongPath(path, progress);

                        if (position) {
                             newBusPositions[route.id] = { lat: position.lat(), lng: position.lng() };
                        } else {
                            newBusPositions[route.id] = route.origin;
                        }
                    } else {
                        console.error(`Directions request failed for route ${route.name} due to ${status}`);
                    }

                    if (routesProcessed === routes.length) {
                        setDirections(newDirections);
                        setBusPositions(newBusPositions);
                    }
                }
            );
        });

    }, [isLoaded, getPointAlongPath]);


    const handleMarkerMouseOver = useCallback((routeId) => {
        const directionResult = directions[routeId];
        const position = busPositions[routeId];

        if (!directionResult || !position || !isLoaded || !window.google) return;

        const leg = directionResult.routes[0]?.legs[0];
        const durationInTraffic = leg?.duration_in_traffic;
        const progress = MOCK_PROGRESS[routeId] || 0;

        let etaString = "ETA: N/A";
        if (durationInTraffic?.value) {
            const totalSeconds = durationInTraffic.value;
            const remainingSeconds = Math.max(0, Math.round(totalSeconds * (1 - progress)));
            const etaDate = new Date();
            etaDate.setSeconds(etaDate.getSeconds() + remainingSeconds);
            etaString = `ETA: ${etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (leg?.duration) {
            etaString = `Est. Total Trip: ${leg.duration.text}`;
        }

        setActiveMarker({ routeId, position, eta: etaString, name: routes.find(r => r.id === routeId)?.name || 'Unknown Route' });
    }, [directions, busPositions, isLoaded]);

    const handleMarkerMouseOut = useCallback(() => {
        setActiveMarker(null);
    }, []);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // --- Render Logic ---
    if (loadError) {
        return <div>Error loading maps. Check API key and console.</div>;
    }

    // Display loading state
    if (!isLoaded || !busMarkerIcon) { 
         return <div className='px-5 pt-2 pb-5'>Loading Map...</div>;
    }

    // Render the map now that everything is loaded
    return (
        <div className='px-5 pt-2 pb-5'>
            <h3 className="text-3xl font-bold text-emerald-400 mr-2 mb-2">Live Trip Map</h3>
            <div className="map-container" style={{ height: '500px', width: '100%', border: '1px solid #ccc' }}>
                <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={MAP_CENTER}
                    zoom={MAP_ZOOM}
                    onLoad={onMapLoad}
                    options={{
                        disableDefaultUI: true,
                    }}
                >
                    {/* Draw Polylines */}
                    {Object.entries(directions).map(([routeId, result]) => {
                        const routeConfig = routes.find(r => r.id === routeId);
                        return (
                            <Polyline
                                key={routeId}
                                path={result.routes[0]?.overview_path}
                                options={{
                                    strokeColor: routeConfig?.color || '#FF0000',
                                    strokeWeight: 4,
                                    strokeOpacity: 0.8,
                                    zIndex: 1
                                }}
                            />
                        )
                    })}

                    {/* Draw Markers */}
                    {Object.entries(busPositions).map(([routeId, position]) => (
                        <Marker
                            key={`marker-${routeId}`}
                            position={position}
                            icon={busMarkerIcon} // Use the memoized icon object
                            title={routes.find(r => r.id === routeId)?.name}
                            onMouseOver={() => handleMarkerMouseOver(routeId)}
                            onMouseOut={handleMarkerMouseOut}
                            zIndex={2}
                        />
                    ))}

                    {/* Info Window */}
                    {activeMarker && (
                        <InfoWindow
                            position={activeMarker.position}
                            onCloseClick={() => setActiveMarker(null)}
                             options={{ zIndex: 3 }}
                        >
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{activeMarker.name}</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{activeMarker.eta}</p>
                            </div>
                        </InfoWindow>
                    )}

                </GoogleMap>
            </div>
        </div>
    );
}

export default LocationCardTemplate;