import catalogData from "./products.json";

export type CatalogProduct = {
  id: string;
  sku: string | null;
  slug: string;
  name: string;
  type: string;
  category: string;
  brand: string | null;
  description: string;
  price: number;
  regularPrice: number;
  inStock: boolean;
  image: string | null;
  gallery: string[];
};

export const catalog = catalogData as CatalogProduct[];

export const catalogCategories = [
  "Integratori",
  "Igiene e cosmesi",
  "Articoli sanitari",
  "Erboristeria",
  "Farmaci da banco",
  "Veterinaria",
  "Altri prodotti",
];

