import { catalog, catalogCategories } from "@/app/data/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "Tutti";
  const availability = searchParams.get("availability") || "all";
  const sort = searchParams.get("sort") || "featured";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    36,
    Math.max(12, Number(searchParams.get("pageSize")) || 24),
  );

  let results = catalog.filter((product) => {
    const matchesQuery =
      !query ||
      `${product.name} ${product.brand || ""} ${product.category} ${
        product.sku || ""
      }`
        .toLowerCase()
        .includes(query);
    const matchesCategory =
      category === "Tutti" || product.category === category;
    const matchesAvailability =
      availability !== "available" || product.inStock;
    return matchesQuery && matchesCategory && matchesAvailability;
  });

  results = [...results].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "discount") {
      const discountA = 1 - a.price / (a.regularPrice || a.price);
      const discountB = 1 - b.price / (b.regularPrice || b.price);
      return discountB - discountA;
    }
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    const saleA = a.regularPrice > a.price ? 1 : 0;
    const saleB = b.regularPrice > b.price ? 1 : 0;
    return saleB - saleA;
  });

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;

  return Response.json({
    items: results.slice(offset, offset + pageSize).map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      regularPrice: product.regularPrice,
      inStock: product.inStock,
      image: product.image,
    })),
    page: safePage,
    pageSize,
    total,
    totalPages,
    categories: catalogCategories.map((name) => ({
      name,
      count: catalog.filter((product) => product.category === name).length,
    })),
  });
}

