// Importing necessary modules from 'next/server' and 'pg'
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Creating a new connection pool to the PostgreSQL database using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Asynchronous function to handle GET requests
export async function GET() {
  // Acquiring a client from the pool
  const client = await pool.connect();
  try {
    // Executing a SQL query to select all rows from the 'articles' table
    const res = await client.query('SELECT * FROM articles');
    // Returning the query results as a JSON response
    return NextResponse.json(res.rows);
  } finally {
    // Releasing the client back to the pool
    client.release();
  }
}

// Asynchronous function to handle DELETE requests
export async function DELETE(req) {
  // Extracting the 'id' query parameter from the request URL
  const id = req.nextUrl.searchParams.get('id');
  // Acquiring a client from the pool
  const client = await pool.connect();
  try {
    // Executing a SQL query to delete the row with the specified 'id' from the 'articles' table
    const res = await client.query('DELETE FROM articles WHERE id = $1', [id]);
    // If no rows were deleted, return a 404 response
    if (res.rowCount === 0) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }
    // Returning a success message as a JSON response
    return NextResponse.json({ message: 'Article deleted' });
  } finally {
    // Releasing the client back to the pool
    client.release();
  }
}
