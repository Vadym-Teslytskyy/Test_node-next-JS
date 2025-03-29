import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/dataBaseConnection';

/**
 * DELETE /api/users/[id]
 *
 * Deletes a specific user based on the provided ID in the URL.
 *
 * @param req - The NextRequest object.
 * @param params - An object containing route parameters; expects { id: string }.
 * @returns A JSON response indicating success or an error message.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    return NextResponse.json({ message: `User ${userId} deleted` });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user(s)" }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id]
 *
 * Updates a specific user's information based on the provided ID.
 *
 * Expects a JSON body with:
 * - name: string
 * - email: string
 *
 * @param req - The NextRequest object containing the JSON body.
 * @param params - An object containing route parameters; expects { id: string }.
 * @returns A JSON response indicating that the user was updated.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, email } = await req.json();
  await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, params.id]);
  return NextResponse.json({ message: 'User updated' });
}
