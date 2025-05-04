export const data = [
    {
        "date": "April 31, 2025",
        "trips": 5,
    },
    {
        "date": "May 1, 2025",
        "trips": 8,
    },
    {
        "date": "May 2, 2025",
        "trips": 3,
    },
    {
        "date": "May 3, 2025",
        "trips": 8,
    },
    {
        "date": "May 4, 2025",
        "trips": 5,
    },
    {
        "date": "May 5, 2025",
        "trips": 6,
    },
];

export const routes = [
    { 
        id: 'route1', 
        name: 'CBD to Juja', 
        origin: 
        { lat: -1.283, 
            lng: 36.817 
        }, 
        destination: 
        { lat: -1.101, 
            lng: 37.011 
        }, 
        color: '#FF0000' 
    },
    { 
        id: 'route2', 
        name: 'CBD to Kikuyu', 
        origin: 
        { 
            lat: -1.283, 
            lng: 36.817 }, 
        destination: 
        {
            lat: -1.256, 
            lng: 36.665 },
        color: '#00FF00' },
    { 
        id: 'route3', 
        name: 'CBD to JKIA', 
        origin: 
        { lat: -1.283, 
            lng: 36.817 
        }, 
        destination: 
        { 
            lat: -1.319, 
            lng: 36.927 
        }, 
        color: '#0000FF' },
    { 
        id: 'route4', 
        name: 'City Stadium to Dandora', 
        origin: 
        { 
            lat: -1.300, 
            lng: 36.838 
        }, 
        destination: { 
            lat: -1.251, 
            lng: 36.905 
        }, 
        color: '#FFFF00' 
    },
    { 
        id: 'route5', 
        name: 'CBD to Civo (Civil Servants)', 
        origin: 
        { 
            lat: -1.283, 
            lng: 36.817 
        }, 
        destination: { 
            lat: -1.270, 
            lng: 36.808 
        }, 
        color: '#FF00FF' }, // Approx Upper Hill area
    { 
        id: 'route6', 
        name: 'CBD to Utawala', 
        origin: 
        { 
            lat: -1.283, 
            lng: 36.817 }, 
        destination: 
        { 
            lat: -1.300, 
            lng: 37.005 
        }, 
        color: '#00FFFF' 
    }
];
  
export const MOCK_PROGRESS = {
    route1: 0.4, // 40% complete
    route2: 0.6, // 60% complete
    route3: 0.2, // 20% complete
    route4: 0.7, // 70% complete
    route5: 0.9, // 90% complete
    route6: 0.3, // 30% complete
};