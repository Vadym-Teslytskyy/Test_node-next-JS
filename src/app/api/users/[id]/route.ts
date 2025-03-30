import { NextRequest, NextResponse } from "next/server";
import { deleteUserById, updateUserById } from "@/app/services/userService";

/**
 * DELETE /api/users/[id]
 *
 * Deletes a specific user based on the provided ID.
 *
 * @param req - The NextRequest object.
 * @param param0 - Object containing route parameters; expects { id: string }.
 * @returns A JSON response indicating success or an error message.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    await deleteUserById(userId);
    return NextResponse.json({ message: `User ${userId} deleted successfully` });
  } catch (error: any) {
    console.error("Route DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id]
 *
 * Updates a specific user's details.
 * Expects a JSON payload with:
 * - name: string
 * - email: string
 *
 * @param req - The NextRequest object containing the JSON payload.
 * @param param0 - Object containing route parameters; expects { id: string }.
 * @returns A JSON response indicating success or an error message.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const { name, email } = await req.json();
    
    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    
    await updateUserById(userId, name, email);
    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("Route PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
