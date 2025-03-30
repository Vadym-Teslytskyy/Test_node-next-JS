import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser, deleteAllUsersService } from "@/app/services/userService";

/**
 * GET /api/users
 *
 * Retrieves all users.
 *
 * @returns NextResponse with an array of users or an error message.
 */
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Route GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/users
 *
 * Creates a new user.
 * Expects a JSON payload with:
 * - name: string
 * - email: string
 *
 * @param req - The NextRequest object containing the JSON payload.
 * @returns NextResponse with a success message or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    await createUser(name, email);
    return NextResponse.json({ message: "User added successfully" });
  } catch (error: any) {
    console.error("Route POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/users
 *
 * Deletes all users.
 *
 * @returns NextResponse with a success message or an error message.
 */
export async function DELETE() {
  try {
    await deleteAllUsersService();
    return NextResponse.json({ message: "All users deleted successfully" });
  } catch (error: any) {
    console.error("Route DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
