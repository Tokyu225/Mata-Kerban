import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const url = await uploadFile(file, "lapors");

    if (!url) {
      return NextResponse.json({ error: "Gagal mengupload file" }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
