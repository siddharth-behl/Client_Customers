export async function onRequest(context) {
  // Target Worker URL
  const destination = 'https://customersdata.siddharth-websites.workers.dev/';
  
  // Re-create the request to send to the worker
  const newRequest = new Request(destination, {
      method: context.request.method,
      headers: context.request.headers,
      // body: context.request.body, // Pass body if needed (GET requests usually don't have one)
  });

  try {
      const response = await fetch(newRequest);
      return response;
  } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
