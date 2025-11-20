// packages/workers/travel-agent/src/index.ts - Travel Agent Tool for Nano Banana Architecture
import { Hono } from 'hono';

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Travel Agent (Nano Banana Architecture)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /compute-route endpoint - Compute optimal route between two points
app.post('/compute-route', async (c: any) => {
  try {
    const { origin, destination, mode, alternatives }: {
      origin: { lat: number; lng: number } | string;
      destination: { lat: number; lng: number } | string;
      mode?: string;
      alternatives?: boolean;
    } = await c.req.json();
    
    // Validate required fields
    if (!origin || !destination) {
      return c.json({ error: 'Missing required fields: origin and destination' }, 400);
    }
    
    console.log(`Computing route from ${JSON.stringify(origin)} to ${JSON.stringify(destination)}`);
    
    // Format origin and destination for cache key
    const originStr = typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`;
    const destinationStr = typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`;
    
    // Build cache key (Nano Banana optimization)
    const cacheKey = `route_${originStr}_${destinationStr}_${mode || 'driving'}_${alternatives || false}`;
    
    // Check KV cache first (Nano Banana optimization)
    let cachedResult: any = null;
    
    if (c.env.TRAVEL_CACHE) {
      try {
        cachedResult = await c.env.TRAVEL_CACHE.get(cacheKey, 'json');
        if (cachedResult) {
          console.log('Returning cached route computation');
          return c.json({
            ...cachedResult,
            cached: true,
            timestamp: Date.now()
          });
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
      }
    }
    
    // TODO: Implement actual Google Maps Routes API call
    // This is a simplified version - in production, you would call:
    // https://routes.googleapis.com/directions/v2:computeRoutes
    // 
    // Example API call:
    // const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Goog-Api-Key': c.env.GOOGLE_MAPS_API_KEY,
    //     'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
    //   },
    //   body: JSON.stringify({
    //     origin: { location: { latLng: origin } },
    //     destination: { location: { latLng: destination } },
    //     travelMode: mode || 'DRIVE',
    //     computeAlternativeRoutes: alternatives || false
    //   })
    // });
    
    // Mock response for now
    const mockRoute = {
      origin,
      destination,
      mode: mode || 'driving',
      duration: '30 mins',
      distance: '25 km',
      polyline: 'mock_polyline_data',
      steps: [
        {
          instruction: 'Head north on Main St',
          distance: '5 km',
          duration: '10 mins'
        },
        {
          instruction: 'Turn right on Oak Ave',
          distance: '10 km',
          duration: '15 mins'
        },
        {
          instruction: 'Arrive at destination',
          distance: '10 km',
          duration: '5 mins'
        }
      ]
    };
    
    // Cache the result (Nano Banana optimization)
    if (c.env.TRAVEL_CACHE) {
      try {
        await c.env.TRAVEL_CACHE.put(cacheKey, JSON.stringify(mockRoute), {
          expirationTtl: 86400 // Cache for 24 hours
        });
        console.log('Cached route computation');
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    return c.json({
      ...mockRoute,
      cached: false,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Error computing route:', error);
    return c.json({ error: 'Failed to compute route' }, 500);
  }
});

// POST /compute-route-matrix endpoint - Compute route matrix for multiple origins/destinations
app.post('/compute-route-matrix', async (c: any) => {
  try {
    const { origins, destinations, mode }: {
      origins: Array<{ lat: number; lng: number } | string>;
      destinations: Array<{ lat: number; lng: number } | string>;
      mode?: string;
    } = await c.req.json();
    
    // Validate required fields
    if (!origins || !destinations || origins.length === 0 || destinations.length === 0) {
      return c.json({ error: 'Missing required fields: origins and destinations' }, 400);
    }
    
    console.log(`Computing route matrix for ${origins.length} origins and ${destinations.length} destinations`);
    
    // Build cache key (Nano Banana optimization)
    const originsStr = origins.map(o => typeof o === 'string' ? o : `${o.lat},${o.lng}`).join('|');
    const destinationsStr = destinations.map(d => typeof d === 'string' ? d : `${d.lat},${d.lng}`).join('|');
    const cacheKey = `route_matrix_${originsStr}_${destinationsStr}_${mode || 'driving'}`;
    
    // Check KV cache first (Nano Banana optimization)
    let cachedResult: any = null;
    
    if (c.env.TRAVEL_CACHE) {
      try {
        cachedResult = await c.env.TRAVEL_CACHE.get(cacheKey, 'json');
        if (cachedResult) {
          console.log('Returning cached route matrix');
          return c.json({
            ...cachedResult,
            cached: true,
            timestamp: Date.now()
          });
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
      }
    }
    
    // TODO: Implement actual Google Maps Route Matrix API call
    // This is a simplified version - in production, you would call:
    // https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix
    // 
    // Example API call:
    // const response = await fetch('https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Goog-Api-Key': c.env.GOOGLE_MAPS_API_KEY,
    //     'X-Goog-FieldMask': 'originIndex,destinationIndex,status,duration,distanceMeters'
    //   },
    //   body: JSON.stringify({
    //     origins: origins.map(o => ({ location: { latLng: o } })),
    //     destinations: destinations.map(d => ({ location: { latLng: d } })),
    //     travelMode: mode || 'DRIVE'
    //   })
    // });
    
    // Mock response for now
    const mockMatrix = {
      origins,
      destinations,
      mode: mode || 'driving',
      matrix: origins.map((origin, originIndex) => 
        destinations.map((destination, destIndex) => ({
          originIndex,
          destinationIndex,
          duration: `${15 + Math.floor(Math.random() * 45)} mins`,
          distance: `${5 + Math.floor(Math.random() * 50)} km`,
          status: 'OK'
        }))
      )
    };
    
    // Cache the result (Nano Banana optimization)
    if (c.env.TRAVEL_CACHE) {
      try {
        await c.env.TRAVEL_CACHE.put(cacheKey, JSON.stringify(mockMatrix), {
          expirationTtl: 86400 // Cache for 24 hours
        });
        console.log('Cached route matrix');
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    return c.json({
      ...mockMatrix,
      cached: false,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Error computing route matrix:', error);
    return c.json({ error: 'Failed to compute route matrix' }, 500);
  }
});

// POST /find-nearby-places endpoint - Find nearby places of interest
app.post('/find-nearby-places', async (c: any) => {
  try {
    const { location, radius, type }: {
      location: { lat: number; lng: number } | string;
      radius?: number;
      type?: string;
    } = await c.req.json();
    
    // Validate required fields
    if (!location) {
      return c.json({ error: 'Missing required field: location' }, 400);
    }
    
    console.log(`Finding nearby places of type ${type || 'any'} near ${JSON.stringify(location)}`);
    
    // Format location for cache key
    const locationStr = typeof location === 'string' ? location : `${location.lat},${location.lng}`;
    
    // Build cache key (Nano Banana optimization)
    const cacheKey = `nearby_${locationStr}_${radius || 1000}_${type || 'any'}`;
    
    // Check KV cache first (Nano Banana optimization)
    let cachedResult: any = null;
    
    if (c.env.TRAVEL_CACHE) {
      try {
        cachedResult = await c.env.TRAVEL_CACHE.get(cacheKey, 'json');
        if (cachedResult) {
          console.log('Returning cached nearby places');
          return c.json({
            ...cachedResult,
            cached: true,
            timestamp: Date.now()
          });
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
      }
    }
    
    // TODO: Implement actual Google Places API call
    // This is a simplified version - in production, you would call Google Places API
    
    // Mock response for now
    const mockPlaces = {
      location,
      radius: radius || 1000,
      type: type || 'any',
      places: [
        {
          name: "Central Park",
          address: "New York, NY 10024",
          rating: 4.7,
          types: ["park", "tourist_attraction"],
          distance: "0.5 km"
        },
        {
          name: "Metropolitan Museum of Art",
          address: "1000 5th Ave, New York, NY 10028",
          rating: 4.8,
          types: ["museum", "tourist_attraction"],
          distance: "1.2 km"
        },
        {
          name: "Empire State Building",
          address: "20 W 34th St, New York, NY 10001",
          rating: 4.6,
          types: ["landmark", "tourist_attraction"],
          distance: "2.1 km"
        }
      ]
    };
    
    // Cache the result (Nano Banana optimization)
    if (c.env.TRAVEL_CACHE) {
      try {
        await c.env.TRAVEL_CACHE.put(cacheKey, JSON.stringify(mockPlaces), {
          expirationTtl: 86400 // Cache for 24 hours
        });
        console.log('Cached nearby places');
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    return c.json({
      ...mockPlaces,
      cached: false,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Error finding nearby places:', error);
    return c.json({ error: 'Failed to find nearby places' }, 500);
  }
});

export default app;