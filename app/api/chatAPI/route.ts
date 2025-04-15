export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    // Get the original request body
    const requestBody = await req.json();
    
    // Forward the request to Django backend
    const djangoResponse = await fetch('http://localhost:8000/api/chatAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    // Get the response data
    const data = await djangoResponse.json();
    
    // Return the response from Django
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error('Error forwarding to Django backend:', error);
    return new Response(JSON.stringify({ error: 'Failed to connect to backend service' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Also implement GET if needed
export async function GET(req: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: 'Method not supported' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}