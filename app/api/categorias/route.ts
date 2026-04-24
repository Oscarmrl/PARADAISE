import { getCategories } from "@/lib/products";

export async function GET() {
  try {
    const categories = await getCategories();
    return Response.json(categories);
  } catch {
    return Response.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}
