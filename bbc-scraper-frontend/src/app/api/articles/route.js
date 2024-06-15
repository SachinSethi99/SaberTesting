import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM articles');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error('Error executing query', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM articles WHERE id = $1', [id]);
    return new Response(JSON.stringify({ message: 'Article deleted' }), { status: 200 });
  } catch (error) {
    console.error('Error executing query', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    client.release();
  }
}
