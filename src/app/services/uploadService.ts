import * as XLSX from "xlsx";
import pool from "@/app/lib/dataBaseConnection";

/**
 * Processes an uploaded Excel file and inserts each row into the users table.
 *
 * @param file - The uploaded File object.
 * @returns The number of rows inserted.
 * @throws Error if file processing or database insertion fails.
 */
export async function processUploadedFile(file: File): Promise<number> {
  // Convert the file to a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Parse the Excel workbook using xlsx
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  // Convert the sheet to JSON; each row should have keys like "Name", "Email", and optionally "Created At"
  const rows = XLSX.utils.sheet_to_json(worksheet);

  // Get a connection from the pool
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const row of rows) {
      // Extract values from the row; adjust these keys to match your Excel file
      const name = (row as any).Name;
      const email = (row as any).Email;
      // If "Created At" is not provided, default to the current date/time
      const createdAt = (row as any)["Created At"] || new Date();

      if (!name || !email) {
        // Skip rows with missing critical fields
        console.warn("Skipping row due to missing fields:", row);
        continue;
      }

      // Insert the user record into the database (ID is auto-incremented)
      await connection.query(
        "INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)",
        [name, email, createdAt]
      );
    }

    await connection.commit();
    return rows.length;
  } catch (error: any) {
    await connection.rollback();
    console.error("processUploadedFile error:", error);
    throw new Error("Database error during file processing: " + error.message);
  } finally {
    connection.release();
  }
}
