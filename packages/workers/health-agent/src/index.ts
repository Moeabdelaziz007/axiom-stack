// packages/workers/health-agent/src/index.ts - Health Agent Tool for Nano Banana Architecture
import { Hono } from 'hono';

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Health Agent (Nano Banana Architecture)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /get-health-recommendations endpoint - Get health recommendations from MyHealthfinder API
app.post('/get-health-recommendations', async (c: any) => {
  try {
    const { age, sex, pregnant, sexualActivity, tobaccoUse }: {
      age: number;
      sex: string;
      pregnant?: boolean;
      sexualActivity?: string;
      tobaccoUse?: string;
    } = await c.req.json();
    
    // Validate required fields
    if (!age || !sex) {
      return c.json({ error: 'Missing required fields: age and sex' }, 400);
    }
    
    // Validate age range
    if (age < 0 || age > 120) {
      return c.json({ error: 'Age must be between 0 and 120' }, 400);
    }
    
    // Validate sex
    if (sex !== 'male' && sex !== 'female') {
      return c.json({ error: 'Sex must be "male" or "female"' }, 400);
    }
    
    console.log(`Getting health recommendations for ${age} year old ${sex}`);
    
    // Build MyHealthfinder API query parameters
    const params = new URLSearchParams();
    params.append('age', age.toString());
    params.append('sex', sex);
    
    if (pregnant !== undefined) {
      params.append('pregnant', pregnant.toString());
    }
    
    if (sexualActivity) {
      params.append('sexualActivity', sexualActivity);
    }
    
    if (tobaccoUse) {
      params.append('tobaccoUse', tobaccoUse);
    }
    
    // Check KV cache first (Nano Banana optimization)
    const cacheKey = `health_rec_${age}_${sex}_${pregnant || 'null'}_${sexualActivity || 'null'}_${tobaccoUse || 'null'}`;
    let cachedResult: any = null;
    
    if (c.env.HEALTH_CACHE) {
      try {
        cachedResult = await c.env.HEALTH_CACHE.get(cacheKey, 'json');
        if (cachedResult) {
          console.log('Returning cached health recommendations');
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
    
    // TODO: Implement actual MyHealthfinder API call
    // This is a simplified version - in production, you would call:
    // https://healthfinder.gov/Developer/Search.aspx
    // 
    // Example API call:
    // const response = await fetch(`https://healthfinder.gov/api/v1/myhealthfinder.json?${params}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // Mock response for now
    const mockRecommendations = {
      recommendations: [
        {
          title: "Get Regular Exercise",
          description: "Adults should get at least 150 minutes of moderate-intensity aerobic activity per week.",
          category: "Physical Activity",
          frequency: "Weekly"
        },
        {
          title: "Eat a Healthy Diet",
          description: "Focus on fruits, vegetables, whole grains, and lean proteins.",
          category: "Nutrition",
          frequency: "Daily"
        },
        {
          title: "Get Enough Sleep",
          description: "Most adults need 7-9 hours of sleep per night.",
          category: "Sleep",
          frequency: "Daily"
        }
      ],
      personalized: true,
      age,
      sex,
      pregnant,
      sexualActivity,
      tobaccoUse
    };
    
    // Cache the result (Nano Banana optimization)
    if (c.env.HEALTH_CACHE) {
      try {
        await c.env.HEALTH_CACHE.put(cacheKey, JSON.stringify(mockRecommendations), {
          expirationTtl: 86400 // Cache for 24 hours
        });
        console.log('Cached health recommendations');
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    return c.json({
      ...mockRecommendations,
      cached: false,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Error getting health recommendations:', error);
    return c.json({ error: 'Failed to get health recommendations' }, 500);
  }
});

// POST /search-health-topics endpoint - Search health topics
app.post('/search-health-topics', async (c: any) => {
  try {
    const { query }: { query: string } = await c.req.json();
    
    // Validate required fields
    if (!query) {
      return c.json({ error: 'Missing required field: query' }, 400);
    }
    
    console.log(`Searching health topics for: ${query}`);
    
    // Check KV cache first (Nano Banana optimization)
    const cacheKey = `health_search_${query}`;
    let cachedResult: any = null;
    
    if (c.env.HEALTH_CACHE) {
      try {
        cachedResult = await c.env.HEALTH_CACHE.get(cacheKey, 'json');
        if (cachedResult) {
          console.log('Returning cached health search results');
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
    
    // TODO: Implement actual health topic search
    // This is a simplified version - in production, you would search a health database
    
    // Mock response for now
    const mockResults = {
      query,
      results: [
        {
          title: "Exercise and Physical Activity",
          description: "Learn about the benefits of regular physical activity and how to get started.",
          url: "https://healthfinder.gov/topics/exercise"
        },
        {
          title: "Healthy Eating",
          description: "Tips for maintaining a balanced diet and making healthy food choices.",
          url: "https://healthfinder.gov/topics/nutrition"
        },
        {
          title: "Mental Health",
          description: "Resources for maintaining good mental health and managing stress.",
          url: "https://healthfinder.gov/topics/mental-health"
        }
      ]
    };
    
    // Cache the result (Nano Banana optimization)
    if (c.env.HEALTH_CACHE) {
      try {
        await c.env.HEALTH_CACHE.put(cacheKey, JSON.stringify(mockResults), {
          expirationTtl: 86400 // Cache for 24 hours
        });
        console.log('Cached health search results');
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    return c.json({
      ...mockResults,
      cached: false,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Error searching health topics:', error);
    return c.json({ error: 'Failed to search health topics' }, 500);
  }
});

export default app;