import { getSetting, setSetting } from "@/lib/settings";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return Response.json({ error: "key requerido" }, { status: 400 });
  try {
    const value = await getSetting(key);
    return Response.json({ value });
  } catch {
    return Response.json({ error: "Error al obtener setting" }, { status: 500 });
  }
}

function verifyAdmin(req: NextRequest): boolean {
  return req.headers.get("authorization")?.replace("Bearer ", "") === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  try {
    const { key, value } = await req.json();
    await setSetting(key, value);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Error al guardar setting" }, { status: 500 });
  }
}
