import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM articles');
    return NextResponse.json(res.rows);
  } finally {
    client.release();
  }
}

export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get('id');
  const client = await pool.connect();
  try {
    const res = await client.query('DELETE FROM articles WHERE id = $1', [id]);
    if (res.rowCount === 0) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Article deleted' });
  } finally {
    client.release();
  }
}
