
import { corsHeaders } from './cors.ts';

// Generic handler for CORS preflight requests
export function handleCorsPreflightRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    });
  }
  return null;
}

// Parse request body for parameters
export async function parseRequestBody(req: Request) {
  let query = '';
  let filterParams = {};
  
  if (req.method === 'POST') {
    try {
      const contentType = req.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const clonedReq = req.clone();
        const text = await clonedReq.text();
        
        if (text && text.trim() !== '') {
          try {
            const body = JSON.parse(text);
            query = body.query || '';
            filterParams = body.filters || {};
          } catch (e) {
            console.error("JSON parse error:", e.message);
          }
        }
      }
    } catch (e) {
      console.error('Error parsing request body:', e);
    }
  }
  
  return { query, filterParams };
}

// Standardized response helper
export function createResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status,
    }
  );
}

// Error response helper
export function createErrorResponse(error: Error, status = 500) {
  console.error("Error in Edge Function:", error);
  return new Response(
    JSON.stringify({ error: error.message, services: [] }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status,
    }
  );
}
