export async function GET() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    return new Response(JSON.stringify({ databaseUrl: process.env.DATABASE_URL }), { status: 200 });
  }
  