import pool from "./db";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  offer_price: number | null;
  category_id: number | null;
  category_name?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  is_featured: boolean;
  is_sale: boolean;
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<Category[]> {
  const { rows } = await pool.query<Category>(
    "SELECT * FROM categories ORDER BY name"
  );
  return rows;
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<Category> {
  const { rows } = await pool.query<Category>(
    `INSERT INTO categories (name, slug, image_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.slug, data.image_url ?? null]
  );
  return rows[0];
}

export async function updateCategory(id: number, data: Partial<Omit<Category, "id">>): Promise<Category | null> {
  const fields = Object.keys(data) as (keyof typeof data)[];
  if (fields.length === 0) return null;
  const sets = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  const values = fields.map((f) => data[f]);
  const { rows } = await pool.query<Category>(
    `UPDATE categories SET ${sets} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] ?? null;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    "DELETE FROM categories WHERE id = $1",
    [id]
  );
  return (rowCount ?? 0) > 0;
}

export async function getProducts(opts?: {
  search?: string;
  categorySlug?: string;
  featured?: boolean;
  onSale?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const conditions: string[] = [];
  const values: (string | boolean | number)[] = [];
  let i = 1;

  if (opts?.search) {
    conditions.push(`p.name ILIKE $${i++}`);
    values.push(`%${opts.search}%`);
  }
  if (opts?.categorySlug) {
    conditions.push(`c.slug = $${i++}`);
    values.push(opts.categorySlug);
  }
  if (opts?.featured !== undefined) {
    conditions.push(`p.is_featured = $${i++}`);
    values.push(opts.featured);
  }
  if (opts?.onSale) {
    conditions.push(`p.is_sale = true`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts?.limit ? `LIMIT ${opts.limit}` : "";

  const { rows } = await pool.query<Product>(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY p.created_at DESC
     ${limit}`,
    values
  );
  return rows;
}

export async function getProductById(id: number): Promise<Product | null> {
  const { rows } = await pool.query<Product>(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createProduct(
  data: Omit<Product, "id" | "created_at" | "updated_at" | "category_name">
): Promise<Product> {
  const { rows } = await pool.query<Product>(
    `INSERT INTO products
       (name, slug, description, price, offer_price, category_id, images, colors, sizes, is_featured, is_sale)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      data.name,
      data.slug,
      data.description,
      data.price,
      data.offer_price ?? null,
      data.category_id,
      data.images,
      data.colors,
      data.sizes,
      data.is_featured,
      data.is_sale,
    ]
  );
  return rows[0];
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id" | "created_at" | "updated_at" | "category_name">>
): Promise<Product | null> {
  const fields = Object.keys(data) as (keyof typeof data)[];
  if (fields.length === 0) return null;

  const sets = fields.map((f, idx) => `${f} = $${idx + 2}`).join(", ");
  const values = fields.map((f) => data[f]);

  const { rows } = await pool.query<Product>(
    `UPDATE products SET ${sets}, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] ?? null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
