import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  CreditCard,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/app/data/catalog";
import { AddToCart } from "./add-to-cart";

const money = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = catalog.find((item) => item.slug === slug);

  if (!product) return { title: "Prodotto non trovato" };

  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: product.image
      ? {
          title: `${product.name} | Nowpharma`,
          description: product.description.slice(0, 155),
          images: [product.image],
        }
      : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = catalog.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = catalog
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id &&
        item.inStock,
    )
    .slice(0, 4);
  const discount =
    product.regularPrice > product.price
      ? Math.round((1 - product.price / product.regularPrice) * 100)
      : 0;

  return (
    <main className="product-page">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>
            <Truck size={15} /> Spedizione gratuita da €39,90
          </span>
          <a href="https://wa.me/393515078701">
            <Headphones size={15} /> Assistenza WhatsApp
          </a>
        </div>
      </div>
      <header className="catalog-header">
        <div className="shell catalog-header-inner product-header-inner">
          <Link className="brand" href="/">
            <img src="/logo-nowpharma.png" alt="Nowpharma" />
          </Link>
          <nav>
            <Link href="/catalogo">Catalogo</Link>
            <Link href="/#prodotti">Offerte</Link>
            <Link href="/#fiducia">Perché Nowpharma</Link>
          </nav>
          <Link className="product-header-cart" href="/catalogo">
            Continua gli acquisti
          </Link>
        </div>
      </header>

      <div className="shell product-breadcrumb">
        <Link href="/catalogo">
          <ArrowLeft size={16} /> Catalogo
        </Link>
        <span>/</span>
        <span>{product.category}</span>
      </div>

      <section className="shell product-hero">
        <div className="product-gallery">
          {discount > 0 && <span className="product-sale">−{discount}%</span>}
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <PackageCheck size={70} />
          )}
        </div>
        <div className="product-details">
          <p className="eyebrow">
            {product.brand || "Nowpharma"} · {product.category}
          </p>
          <h1>{product.name}</h1>
          {product.sku && <p className="product-sku">Codice: {product.sku}</p>}
          <span
            className={`stock-label ${product.inStock ? "available" : ""}`}
          >
            {product.inStock ? "Disponibile subito" : "Momentaneamente esaurito"}
          </span>
          <div className="product-main-price">
            {discount > 0 && <del>{money.format(product.regularPrice)}</del>}
            <strong>{money.format(product.price)}</strong>
            <small>IVA inclusa</small>
          </div>
          <AddToCart
            id={product.id}
            name={product.name}
            inStock={product.inStock}
          />
          <div className="product-delivery-note">
            <Truck size={20} />
            <div>
              <strong>Spedizione gratuita da €39,90</strong>
              <span>Altrimenti €5,50 · Consegna tracciata in Italia</span>
            </div>
          </div>
          <div className="product-payments">
            <span>
              <CreditCard size={18} /> Carta con Stripe
            </span>
            <span>
              <Banknote size={18} /> Contrassegno
            </span>
            <span>
              <Building2 size={18} /> Bonifico
            </span>
          </div>
        </div>
      </section>

      <section className="product-info-section">
        <div className="shell product-info-grid">
          <article>
            <p className="eyebrow">Descrizione</p>
            <h2>Informazioni sul prodotto</h2>
            <p>{product.description}</p>
            <div className="medical-note">
              Le informazioni non sostituiscono il parere del medico o del
              farmacista. Leggere sempre le indicazioni riportate sulla
              confezione.
            </div>
          </article>
          <aside>
            <div>
              <ShieldCheck size={24} />
              <span>
                <strong>Acquisto protetto</strong>
                Pagamenti gestiti in modo sicuro
              </span>
            </div>
            <div>
              <PackageCheck size={24} />
              <span>
                <strong>Catalogo verificato</strong>
                Informazioni migrate dalla fonte ufficiale
              </span>
            </div>
            <div>
              <Headphones size={24} />
              <span>
                <strong>Hai un dubbio?</strong>
                Chiedi assistenza prima dell’acquisto
              </span>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section shell related-products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Potrebbe interessarti</p>
              <h2>Altri prodotti della categoria.</h2>
            </div>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <Link key={item.id} href={`/prodotto/${item.slug}`}>
                <div>
                  {item.image && <img src={item.image} alt="" />}
                </div>
                <p>{item.brand || item.category}</p>
                <h3>{item.name}</h3>
                <strong>{money.format(item.price)}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

