import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: true, token: process.env.ADMIN_PASSWORD });
  }
  return Response.json({ ok: false }, { status: 401 });
}
