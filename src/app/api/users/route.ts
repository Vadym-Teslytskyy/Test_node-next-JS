import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/dataBaseConnection';

/**
 * GET /api/users
 *
 * Retrieves all users from the database.
 *
 * @returns A JSON response containing an array of user records.
 */
export async function GET() {
  const [rows] = await pool.query("SELECT * FROM users");
  return NextResponse.json(rows);
}

/**
 * POST /api/users
 *
 * Creates a new user record.
 *
 * Expects a JSON body with the properties:
 * - name: string
 * - email: string
 *
 * @param req - The NextRequest containing the JSON body.
 * @returns A JSON response indicating success.
 */
export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
  return NextResponse.json({ message: 'User added' });
}

/**
 * DELETE /api/users
 *
 * Deletes all user records from the database.
 *
 * @returns A JSON response indicating that all users were deleted.
 */
export async function DELETE() {
  await pool.query("DELETE FROM users");
  return NextResponse.json({ message: 'All users deleted' });
}
