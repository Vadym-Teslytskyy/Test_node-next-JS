import pool from "@/app/lib/dataBaseConnection";
import { QueryResult } from "mysql2";

/**
 * Retrieves all users from the database.
 *
 * @returns An array of user records.
 * @throws Error if the query fails.
 */
export async function getAllUsers(): Promise<QueryResult> {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      return rows;
    } catch (error: any) {
      console.error("getAllUsers error:", error);
      throw new Error("Error fetching users: " + error.message);
    }
  }
  
  /**
   * Creates a new user in the database.
   *
   * @param name - The name of the user.
   * @param email - The email of the user.
   * @throws Error if name or email is missing or if the query fails.
   */
  export async function createUser(name: string, email: string): Promise<void> {
    if (!name || !email) {
      throw new Error("Name and email are required");
    }
    try {
      await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    } catch (error: any) {
      console.error("createUser error:", error);
      throw new Error("Error creating user: " + error.message);
    }
  }
  
  /**
   * Deletes all users from the database.
   *
   * @throws Error if the query fails.
   */
  export async function deleteAllUsersService(): Promise<void> {
    try {
      await pool.query("DELETE FROM users");
    } catch (error: any) {
      console.error("deleteAllUsersService error:", error);
      throw new Error("Error deleting all users: " + error.message);
    }
  }
  
/**
 * Deletes a user from the database based on the provided ID.
 *
 * @param userId - The ID of the user to delete.
 * @throws Error if the deletion fails.
 */
export async function deleteUserById(userId: string): Promise<void> {
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  } catch (error: any) {
    console.error("deleteUserById error:", error);
    throw new Error("Error deleting user: " + error.message);
  }
}

/**
 * Updates a user in the database with the provided name and email.
 *
 * @param userId - The ID of the user to update.
 * @param name - The new name of the user.
 * @param email - The new email of the user.
 * @throws Error if name or email is missing or if the update fails.
 */
export async function updateUserById(userId: string, name: string, email: string): Promise<void> {
  if (!name || !email) {
    throw new Error("Name and email are required");
  }
  try {
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId]);
  } catch (error: any) {
    console.error("updateUserById error:", error);
    throw new Error("Error updating user: " + error.message);
  }
}
