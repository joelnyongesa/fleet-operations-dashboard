import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { MOCK_PROGRESS } from '../utils/data';

// --- Configuration ---
const MAP_CENTER = { lat: -1.286389, lng: 36.817223 }; // Approx Nairobi CBD
const MAP_ZOOM = 11;
const LIBRARIES = ['places', 'geometry'];

const busIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30px" height="30px">
  <path d="M18.9 2.11a1.5 1.5 0 0 0-1.31.76L16.15 5H7.85L6.41 2.87a1.5 1.5 0 0 0-2.59 1.51L5.2 7.13a3.5 3.5 0 0 0-1.7 2.99V15.5A3.5 3.5 0 0 0 7 19h10a3.5 3.5 0 0 0 3.5-3.5V10.12a3.5 3.5 0 0 0-1.7-2.99l1.38-2.75a1.5 1.5 0 0 0-1.28-2.27ZM8.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM5.17 9l-.63-1.25h14.92L18.83 9H5.17Z"/>
</svg>
`;
const encodedBusIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(busIconSvg)}`;


// --- Component ---
function LocationCardTemplate({ routesData = [] }) {

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAPS_API_KEY || "",
        libraries: LIBRARIES, 
    });

    const [directions, setDirections] = useState({});
    const [busPositions, setBusPositions] = useState({});
    const [activeMarker, setActiveMarker] = useState(null);

    const mapRef = useRef(null);
    const directionsServiceRef = useRef(null);

    const busMarkerIcon = useMemo(() => {
        if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.Size || !window.google.maps.Point) return null;
        return {
            url: encodedBusIcon,
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
        };
    }, [isLoaded]);


    const getPointAlongPath = useCallback((path, fraction) => {
        if (!isLoaded || !window.google?.maps?.geometry?.spherical || !path || path.length < 2) {
            console.warn("Google Maps Geometry library not loaded or path invalid for getPointAlongPath.");
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
        if (isLoaded && window.google && !directionsServiceRef.current) {
            directionsServiceRef.current = new window.google.maps.DirectionsService();
        }

        if (!isLoaded || !directionsServiceRef.current || !routesData || routesData.length === 0) {

            if (routesData.length === 0) {
                setDirections({});
                setBusPositions({});
            }
            return;
        }

        const service = directionsServiceRef.current;
        const newDirections = {};
        const newBusPositions = {};
        let routesProcessedCount = 0;

        const batchedDirections = {};
        const batchedBusPositions = {};

        routesData.forEach(apiRoute => {
            if (!apiRoute || typeof apiRoute.start_latitude !== 'number' || typeof apiRoute.start_longitude !== 'number' ||
                typeof apiRoute.end_latitude !== 'number' || typeof apiRoute.end_longitude !== 'number') {
                console.error("Invalid route data:", apiRoute);
                routesProcessedCount++;
                if (routesProcessedCount === routesData.length) {
                    setDirections(batchedDirections);
                    setBusPositions(batchedBusPositions);
                }
                return;
            }

            const origin = { lat: apiRoute.start_latitude, lng: apiRoute.start_longitude };
            const destination = { lat: apiRoute.end_latitude, lng: apiRoute.end_longitude };

            service.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    routesProcessedCount++;
                    if (status === window.google.maps.DirectionsStatus.OK && result) {
                        batchedDirections[apiRoute.id] = result;

                        const path = result.routes[0]?.overview_path;
                        const progress = MOCK_PROGRESS[apiRoute.id] || 0;
                        const position = getPointAlongPath(path, progress);

                        if (position) {
                            batchedBusPositions[apiRoute.id] = { lat: position.lat(), lng: position.lng() };
                        } else {
                            batchedBusPositions[apiRoute.id] = origin; 
                        }
                    } else {
                        console.error(`Directions request failed for route ${apiRoute.name} (ID: ${apiRoute.id}) due to ${status}`);
                        batchedBusPositions[apiRoute.id] = origin; 
                    }

                    if (routesProcessedCount === routesData.length) {
                        setDirections(batchedDirections);
                        setBusPositions(batchedBusPositions);
                    }
                }
            );
        });

    }, [isLoaded, routesData, getPointAlongPath]);


    const handleMarkerMouseOver = useCallback((routeId) => { 
        const directionResult = directions[routeId];
        const position = busPositions[routeId];
        const apiRoute = routesData.find(r => r.id === routeId);

        if (!directionResult || !position || !apiRoute || !isLoaded || !window.google) return;

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

        setActiveMarker({ routeId, position, eta: etaString, name: apiRoute.name });
    }, [directions, busPositions, isLoaded, routesData]);

    const handleMarkerMouseOut = useCallback(() => {
        setActiveMarker(null);
    }, []);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);


    if (loadError) {
        console.error("Google Maps API load error:", loadError);
        return (
            <div className='px-5 pt-2 pb-5 text-red-600 dark:text-red-400'>
                Error loading maps. Please check your API key and ensure the Google Maps JavaScript API is enabled.
            </div>
        );
    }

    if (!isLoaded) {
         return <div className='px-5 pt-2 pb-5 text-slate-500 dark:text-slate-400'>Loading Map...</div>;
    }

    if (!busMarkerIcon && isLoaded) { 
        console.warn("Bus marker icon not ready yet, though API is loaded.");
        return <div className='px-5 pt-2 pb-5 text-slate-500 dark:text-slate-400'>Initializing map assets...</div>;
    }


    return (
        <div className='px-5 pt-3 pb-5  rounded-lg'>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-4">Live Trip Map</h3>
            <div className="map-container rounded-md overflow-hidden" style={{ height: '500px', width: '100%', border: '1px solid #e2e8f0' }}>
                <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={MAP_CENTER}
                    zoom={MAP_ZOOM}
                    onLoad={onMapLoad}
                    options={{
                        disableDefaultUI: true,
                    }}
                >
                    {Object.entries(directions).map(([routeIdStr, result]) => {
                        const routeId = parseInt(routeIdStr, 10);
                        const routeConfig = routesData.find(r => r.id === routeId);
                        if (!result.routes || result.routes.length === 0) return null; 
                        return (
                            <Polyline
                                key={`poly-${routeId}`}
                                path={result.routes[0]?.overview_path}
                                options={{
                                    strokeColor: routeConfig?.color || '#10B981', 
                                    strokeWeight: 5,
                                    strokeOpacity: 0.75,
                                    zIndex: 1
                                }}
                            />
                        )
                    })}

                    {Object.entries(busPositions).map(([routeIdStr, position]) => {
                         const routeId = parseInt(routeIdStr, 10); 
                         const routeConfig = routesData.find(r => r.id === routeId);
                         if (!busMarkerIcon) return null; 
                         return (
                            <Marker
                                key={`marker-${routeId}`}
                                position={position}
                                icon={busMarkerIcon}
                                title={routeConfig?.name || 'Unknown Route'}
                                onMouseOver={() => handleMarkerMouseOver(routeId)}
                                onMouseOut={handleMarkerMouseOut}
                                zIndex={2}
                            />
                        )
                    })}

                    {activeMarker && (
                        <InfoWindow
                            position={activeMarker.position}
                            onCloseClick={() => setActiveMarker(null)}
                            options={{ zIndex: 3 }}
                        >
                            <div className="p-1 bg-white dark:bg-slate-700 rounded-md shadow-md">
                                <h4 className="m-0 font-semibold text-sm text-slate-700 dark:text-slate-200">{activeMarker.name}</h4>
                                <p className="mt-1 mb-0 text-xs text-slate-600 dark:text-slate-300">{activeMarker.eta}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
}

export default LocationCardTemplate;