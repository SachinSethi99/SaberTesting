// Asynchronous function to handle GET requests
export async function GET() {
  // Log the DATABASE_URL environment variable to the console
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  // Return a JSON response containing the DATABASE_URL environment variable
  return new Response(JSON.stringify({ databaseUrl: process.env.DATABASE_URL }), { status: 200 });
}
