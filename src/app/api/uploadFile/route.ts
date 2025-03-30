import { NextRequest, NextResponse } from "next/server";
import { processUploadedFile } from "@/app/services/uploadService";

/**
 * POST /api/uploadFile
 *
 * This endpoint accepts a multipart form upload containing an Excel file,
 * processes the file using the upload service, and returns a JSON response
 * with the number of inserted records.
 *
 * @param req - The NextRequest containing the file in formData.
 * @returns NextResponse with a success message and totalInserted, or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Process the file and insert user records
    const totalInserted = await processUploadedFile(file);
    return NextResponse.json({
      message: "Users inserted successfully!",
      totalInserted,
    });
  } catch (error: any) {
    console.error("UploadFile route error:", error);
    return NextResponse.json(
      { error: "Error processing file upload: " + error.message },
      { status: 500 }
    );
  }
}
