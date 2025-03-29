import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import pool from "@/app/lib/dataBaseConnection";

/**
 * POST /api/uploadFile
 *
 * This endpoint processes an Excel file upload, parses its content,
 * and inserts each row into the `users` table (ignoring any ID column,
 * since the DB auto-increments it). Database operations are wrapped in a
 * transaction to ensure data integrity.
 *
 * @param req - The NextRequest object containing the uploaded file in formData.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to a Buffer for processing with xlsx
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the Excel file buffer
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    // Insert each row into the database inside a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Loop through each row and insert user data
      for (const row of rows) {
        // Adjust these field names to match your Excel columns
        const name = (row as any).Name;
        const email = (row as any).Email;
        const createdAt = (row as any)["Created At"];

        // Insert into the users table (ID is auto-incremented)
        await connection.query(
          "INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)",
          [name, email, createdAt]
        );
      }

      await connection.commit();
      connection.release();
    } catch (dbError) {
      // Roll back if any insert fails
      await connection.rollback();
      connection.release();
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Error saving users to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Users inserted successfully!",
      totalInserted: rows.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error processing file upload" },
      { status: 500 }
    );
  }
}
