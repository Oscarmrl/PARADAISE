import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/products";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const categories = await getCategories();
    return Response.json(categories);
  } catch {
    return Response.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  return auth.replace("Bearer ", "") === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const category = await createCategory(body);
    return Response.json(category, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Error al crear categoría", detail: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = req.nextUrl;
  const id = Number(searchParams.get("id"));
  if (!id) return Response.json({ error: "ID requerido" }, { status: 400 });
  try {
    const body = await req.json();
    const updated = await updateCategory(id, body);
    if (!updated) return Response.json({ error: "No encontrado" }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: "Error al actualizar", detail: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = req.nextUrl;
  const id = Number(searchParams.get("id"));
  if (!id) return Response.json({ error: "ID requerido" }, { status: 400 });
  try {
    const ok = await deleteCategory(id);
    if (!ok) return Response.json({ error: "No encontrado" }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json({ error: "Error al eliminar categoría", detail: String(err) }, { status: 500 });
  }
}
