import { getProductById, updateProduct, deleteProduct } from "@/lib/products";
import { NextRequest } from "next/server";

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/productos/[id]">) {
  const { id } = await ctx.params;
  const product = await getProductById(Number(id));
  if (!product) return Response.json({ error: "No encontrado" }, { status: 404 });
  return Response.json(product);
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/productos/[id]">) {
  if (!verifyAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const updated = await updateProduct(Number(id), body);
    if (!updated) return Response.json({ error: "No encontrado" }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: "Error al actualizar", detail: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/productos/[id]">) {
  if (!verifyAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await ctx.params;
  const ok = await deleteProduct(Number(id));
  if (!ok) return Response.json({ error: "No encontrado" }, { status: 404 });
  return new Response(null, { status: 204 });
}
