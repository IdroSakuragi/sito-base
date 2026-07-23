"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  PackageSearch,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  price: number;
  regularPrice: number;
  inStock: boolean;
  image: string | null;
};

type CatalogResponse = {
  items: CatalogItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  categories: Array<{ name: string; count: number }>;
};

const money = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export default function CatalogPage() {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tutti");
  const [availability, setAvailability] = useState("available");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notice, setNotice] = useState("");

  const params = useMemo(() => {
    const search = new URLSearchParams({
      q: query,
      category,
      availability,
      sort,
      page: String(page),
      pageSize: "24",
    });
    return search.toString();
  }, [query, category, availability, sort, page]);

  useEffect(() => {
    const stored = JSON.parse(
      window.localStorage.getItem("nowpharma-cart") || "{}",
    ) as Record<string, number>;
    setCartCount(
      Object.values(stored).reduce((sum, quantity) => sum + quantity, 0),
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((result: CatalogResponse) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, [params]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setQuery(queryInput.trim());
  }

  function addToCart(product: CatalogItem) {
    const stored = JSON.parse(
      window.localStorage.getItem("nowpharma-cart") || "{}",
    ) as Record<string, number>;
    stored[product.id] = (stored[product.id] || 0) + 1;
    window.localStorage.setItem("nowpharma-cart", JSON.stringify(stored));
    setCartCount(
      Object.values(stored).reduce((sum, quantity) => sum + quantity, 0),
    );
    setNotice(`${product.name} aggiunto al carrello`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  return (
    <main className="catalog-page">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>
            <Truck size={15} /> Spedizione gratuita da €39,90
          </span>
          <span className="utility-hide">Oltre 1.200 prodotti selezionati</span>
        </div>
      </div>
      <header className="catalog-header">
        <div className="shell catalog-header-inner">
          <Link className="brand" href="/">
            <img src="/logo-nowpharma.png" alt="Nowpharma" />
          </Link>
          <form className="header-search" onSubmit={submitSearch}>
            <Search size={20} />
            <input
              aria-label="Cerca nel catalogo"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Cerca prodotto, marca o codice"
            />
            <button>Cerca</button>
          </form>
          <button className="catalog-cart" aria-label="Apri carrello">
            <ShoppingBag size={21} />
            <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <section className="catalog-intro">
        <div className="shell">
          <Link className="back-link" href="/">
            <ArrowLeft size={16} /> Torna alla home
          </Link>
          <p className="eyebrow">Catalogo Nowpharma</p>
          <h1>Benessere, senza perdere tempo.</h1>
          <p>
            Cerca per prodotto, marca o esigenza. Filtra i risultati e trova
            subito la scelta giusta per te.
          </p>
        </div>
      </section>

      <section className="shell catalog-layout">
        <aside className={`catalog-filters ${filterOpen ? "is-open" : ""}`}>
          <div className="mobile-filter-title">
            <strong>Filtri</strong>
            <button onClick={() => setFilterOpen(false)} aria-label="Chiudi filtri">
              <X size={20} />
            </button>
          </div>
          <div className="filter-block">
            <h2>Categorie</h2>
            <button
              className={category === "Tutti" ? "is-active" : ""}
              onClick={() => {
                setCategory("Tutti");
                setPage(1);
              }}
            >
              <span>Tutti i prodotti</span>
              <b>{data?.categories.reduce((sum, item) => sum + item.count, 0)}</b>
            </button>
            {data?.categories.map((item) => (
              <button
                key={item.name}
                className={category === item.name ? "is-active" : ""}
                onClick={() => {
                  setCategory(item.name);
                  setPage(1);
                  setFilterOpen(false);
                }}
              >
                <span>{item.name}</span>
                <b>{item.count}</b>
              </button>
            ))}
          </div>
          <div className="filter-block availability-filter">
            <h2>Disponibilità</h2>
            <label>
              <input
                type="checkbox"
                checked={availability === "available"}
                onChange={(event) => {
                  setAvailability(event.target.checked ? "available" : "all");
                  setPage(1);
                }}
              />
              <span>Solo disponibili</span>
            </label>
          </div>
          <div className="catalog-help">
            <PackageSearch size={24} />
            <strong>Non trovi ciò che cerchi?</strong>
            <p>Scrivici: ti aiutiamo a individuare il prodotto.</p>
            <a href="https://wa.me/393515078701">Chiedi su WhatsApp</a>
          </div>
        </aside>

        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div>
              <button
                className="mobile-filter-button"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={17} /> Filtri
              </button>
              <p>
                <strong>{data?.total ?? 0}</strong> prodotti trovati
              </p>
            </div>
            <label className="sort-control">
              <span>Ordina per</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >
                <option value="featured">In evidenza</option>
                <option value="discount">Sconto più alto</option>
                <option value="price-asc">Prezzo crescente</option>
                <option value="price-desc">Prezzo decrescente</option>
              </select>
              <ChevronDown size={16} />
            </label>
          </div>

          {loading ? (
            <div className="catalog-loading" role="status">
              <span />
              <p>Sto preparando i prodotti…</p>
            </div>
          ) : data?.items.length ? (
            <>
              <div className="catalog-product-grid">
                {data.items.map((product) => {
                  const discount =
                    product.regularPrice > product.price
                      ? Math.round(
                          (1 - product.price / product.regularPrice) * 100,
                        )
                      : 0;
                  return (
                    <article className="catalog-product" key={product.id}>
                      <Link
                        className="catalog-product-image"
                        href={`/prodotto/${product.slug}`}
                      >
                        {discount > 0 && <span>−{discount}%</span>}
                        <button
                          className="favorite-button"
                          aria-label={`Salva ${product.name}`}
                          onClick={(event) => event.preventDefault()}
                        >
                          <Heart size={18} />
                        </button>
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <PackageSearch size={44} />
                        )}
                      </Link>
                      <div className="catalog-product-content">
                        <p>
                          {product.brand || "Nowpharma"} · {product.category}
                        </p>
                        <Link href={`/prodotto/${product.slug}`}>
                          <h2>{product.name}</h2>
                        </Link>
                        <span
                          className={`stock-label ${
                            product.inStock ? "available" : ""
                          }`}
                        >
                          {product.inStock ? "Disponibile" : "Momentaneamente esaurito"}
                        </span>
                        <div className="catalog-price">
                          <div>
                            {discount > 0 && (
                              <del>{money.format(product.regularPrice)}</del>
                            )}
                            <strong>{money.format(product.price)}</strong>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            title={
                              product.inStock
                                ? "Aggiungi al carrello"
                                : "Prodotto non disponibile"
                            }
                            aria-label={`Aggiungi ${product.name} al carrello`}
                          >
                            <Plus size={19} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <nav className="pagination" aria-label="Paginazione catalogo">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                >
                  <ArrowLeft size={17} /> Precedente
                </button>
                <span>
                  Pagina <strong>{data.page}</strong> di {data.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((current) =>
                      Math.min(data.totalPages, current + 1),
                    )
                  }
                  disabled={page >= data.totalPages}
                >
                  Successiva <ArrowRight size={17} />
                </button>
              </nav>
            </>
          ) : (
            <div className="catalog-empty">
              <Search size={30} />
              <h2>Nessun prodotto trovato</h2>
              <p>Prova a cambiare ricerca o categoria.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setQuery("");
                  setQueryInput("");
                  setCategory("Tutti");
                  setAvailability("available");
                }}
              >
                Azzera i filtri
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="catalog-assurance">
        <div className="shell">
          <span>
            <Check size={18} /> Catalogo verificato
          </span>
          <span>
            <Truck size={18} /> Consegna tracciata
          </span>
          <span>
            <Check size={18} /> Pagamenti protetti
          </span>
        </div>
      </div>

      {notice && (
        <div className="toast" role="status">
          <Check size={18} /> {notice}
        </div>
      )}
    </main>
  );
}

