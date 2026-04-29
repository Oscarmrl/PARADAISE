import { getProducts, createProduct } from "@/lib/products";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("q") ?? undefined;
  const category = searchParams.get("categoria") ?? undefined;
  const featured = searchParams.get("destacados");
  const ofertas = searchParams.get("ofertas");

  try {
    const products = await getProducts({
      search,
      categorySlug: category,
      featured: featured === "1" ? true : undefined,
      onSale: ofertas === "1" ? true : undefined,
    });
    return Response.json(products);
  } catch {
    return Response.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const product = await createProduct(body);
    return Response.json(product, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Error al crear producto", detail: String(err) }, { status: 500 });
  }
}
