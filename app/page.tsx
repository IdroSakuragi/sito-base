"use client";

import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  ChevronDown,
  CircleUserRound,
  CreditCard,
  Headphones,
  Heart,
  Languages,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brand: string;
  category: string;
  need: string;
  price: number;
  regularPrice: number;
  image: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: "8008843010424",
    slug: "normolip-5-60-naturcaps-per-il-colesterolo-3772",
    name: "Normolip 5 · 60 Naturcaps",
    shortName: "Normolip 5",
    brand: "ESI",
    category: "Integratori",
    need: "Controllo del colesterolo",
    price: 30.51,
    regularPrice: 33.9,
    image: "https://www.nowpharma.it/wp-content/uploads/2021/04/Normolip-5.webp",
    badge: "Più scelto",
  },
  {
    id: "8006290804337 - 24 Bottiglie",
    slug: "fonte-essenziale-400ml-acqua-termale-24-bottiglie-da-400ml-10975",
    name: "Fonte Essenziale · 24 bottiglie",
    shortName: "Fonte Essenziale",
    brand: "Fonte Essenziale",
    category: "Benessere quotidiano",
    need: "Fegato e intestino",
    price: 22.5,
    regularPrice: 29.8,
    image:
      "https://www.nowpharma.it/wp-content/uploads/2021/04/Fonte-Essenziale-6x400ml-Acqua-Minerale-Naturale-Termale-Per-Fegato-Ed-Intestino.webp",
    badge: "−24%",
  },
  {
    id: "4897091050559",
    slug: "swisse-beauty-capelli-pelle-unghie-60-compresse-4065",
    name: "Swisse Beauty · Capelli Pelle Unghie",
    shortName: "Swisse Beauty",
    brand: "Swisse",
    category: "Integratori",
    need: "Capelli e unghie",
    price: 21.1,
    regularPrice: 30.9,
    image:
      "https://www.nowpharma.it/wp-content/uploads/2018/10/Swisse-Capelli-Pelle-Unghie-Compresse.webp",
    badge: "−32%",
  },
  {
    id: "8050444858646",
    slug: "rilastil-aqua-30ml-intense-gel-serum-idratante-intensivo-15216",
    name: "Rilastil Aqua · Intense Gel Serum",
    shortName: "Rilastil Aqua",
    brand: "Rilastil",
    category: "Igiene e cosmesi",
    need: "Idratazione intensiva",
    price: 20.9,
    regularPrice: 29,
    image:
      "https://www.nowpharma.it/wp-content/uploads/2022/07/Rilastil-Aqua-Intense-Gel-Serum.webp",
    badge: "−28%",
  },
  {
    id: "8059591192238",
    slug: "helidermina-crema-viso-50ml-antiage-active-plus-4725",
    name: "Helidermina · Crema viso Antiage",
    shortName: "Helidermina Antiage",
    brand: "Helidermina",
    category: "Igiene e cosmesi",
    need: "Viso e antiage",
    price: 27.34,
    regularPrice: 39.8,
    image:
      "https://www.nowpharma.it/wp-content/uploads/2018/10/Helidermina-Crema-Viso-Antiage-Active-Plus.webp",
    badge: "Bio",
  },
  {
    id: "8055510240387",
    slug:
      "rilastil-hydrotenseur-crema-antirughe-40ml-ricca-ristrutturante-15276",
    name: "Rilastil Hydrotenseur · Crema antirughe",
    shortName: "Rilastil Hydrotenseur",
    brand: "Rilastil",
    category: "Igiene e cosmesi",
    need: "Pelle matura",
    price: 26.2,
    regularPrice: 38.9,
    image:
      "https://www.nowpharma.it/wp-content/uploads/2022/07/Rilastil-Hydrotenseur-Crema-Antirughe-Ricca-Ristrutturante.webp",
    badge: "−33%",
  },
];

const categories = [
  { number: "01", label: "Integratori", detail: "Energia e difese" },
  { number: "02", label: "Igiene e cosmesi", detail: "Cura quotidiana" },
  { number: "03", label: "Farmaci da banco", detail: "Salute e sollievo" },
  { number: "04", label: "Articoli sanitari", detail: "Supporto e controllo" },
  { number: "05", label: "Mamma e bambino", detail: "Benessere in famiglia" },
  { number: "06", label: "Veterinaria", detail: "Cura degli animali" },
];

const money = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tutti");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payment, setPayment] = useState<"stripe" | "cod" | "bank">("stripe");
  const [orderSent, setOrderSent] = useState(false);
  const [notice, setNotice] = useState("");
  const [processing, setProcessing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(
      window.localStorage.getItem("nowpharma-cart") || "{}",
    ) as Record<string, number>;
    setCart(stored);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        `${product.name} ${product.brand} ${product.category} ${product.need}`
          .toLowerCase()
          .includes(normalized);
      const matchesCategory =
        activeCategory === "Tutti" || product.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({ ...product, quantity: cart[product.id] }));
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 39.9 ? 0 : 5.5;
  const codFee = payment === "cod" ? 5 : 0;
  const total = subtotal + shipping + codFee;
  const freeShippingLeft = Math.max(0, 39.9 - subtotal);

  function addToCart(product: Product) {
    setCart((current) => {
      const updated = {
        ...current,
        [product.id]: (current[product.id] || 0) + 1,
      };
      window.localStorage.setItem("nowpharma-cart", JSON.stringify(updated));
      return updated;
    });
    setNotice(`${product.shortName} aggiunto al carrello`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function updateQuantity(id: string, delta: number) {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + delta);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      window.localStorage.setItem("nowpharma-cart", JSON.stringify(updated));
      return updated;
    });
  }

  function runSearch(event: FormEvent) {
    event.preventDefault();
    document.getElementById("prodotti")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutMessage("");
    if (payment === "stripe") {
      setProcessing(true);
      try {
        const response = await fetch("/api/stripe-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          }),
        });
        const result = (await response.json()) as {
          url?: string;
          message?: string;
        };
        if (result.url) {
          window.location.assign(result.url);
          return;
        }
        setCheckoutMessage(
          result.message || "Il pagamento Stripe non è ancora disponibile.",
        );
      } catch {
        setCheckoutMessage(
          "Non è stato possibile collegarsi a Stripe. Riprova tra poco.",
        );
      } finally {
        setProcessing(false);
      }
      return;
    }
    setOrderSent(true);
  }

  return (
    <main>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>
            <Truck size={15} aria-hidden="true" /> Spedizione gratuita da €39,90
          </span>
          <a href="https://wa.me/393515078701">
            <Headphones size={15} aria-hidden="true" /> Assistenza WhatsApp
          </a>
          <span className="utility-hide">Consegna tracciata in tutta Italia</span>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-main">
          <a className="brand" href="#" aria-label="Nowpharma, homepage">
            <img src="/logo-nowpharma.png" alt="Nowpharma" />
          </a>

          <form className="header-search" onSubmit={runSearch}>
            <Search size={21} aria-hidden="true" />
            <label className="sr-only" htmlFor="header-query">
              Cerca nel catalogo
            </label>
            <input
              id="header-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca prodotto, marca o esigenza"
            />
            <button type="submit">Cerca</button>
          </form>

          <div className="header-actions">
            <button className="icon-action desktop-action" title="I tuoi preferiti">
              <Heart size={21} aria-hidden="true" />
              <span>Preferiti</span>
            </button>
            <button className="icon-action desktop-action" title="Il tuo account">
              <CircleUserRound size={21} aria-hidden="true" />
              <span>Account</span>
            </button>
            <button
              className="cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Apri il carrello, ${itemCount} articoli`}
            >
              <ShoppingBag size={21} aria-hidden="true" />
              <span>Carrello</span>
              {itemCount > 0 && <b>{itemCount}</b>}
            </button>
            <button
              className="mobile-menu-button"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label="Apri il menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`}>
          <div className="shell nav-inner">
            <a href="/catalogo">
              Categorie <ChevronDown size={15} aria-hidden="true" />
            </a>
            <a href="#prodotti">Offerte</a>
            <a href="#marche">Marche</a>
            <a href="#consigli">Consigli</a>
            <a href="#fiducia">Perché Nowpharma</a>
            <div className="language-control">
              <Languages size={16} aria-hidden="true" />
              <select aria-label="Lingua">
                <option>IT</option>
                <option>EN</option>
                <option>DE</option>
                <option>ES</option>
                <option>PT</option>
                <option>FR</option>
              </select>
            </div>
          </div>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-primary">
          <div className="hero-copy">
            <p className="eyebrow">La tua parafarmacia, ogni giorno</p>
            <h1>
              Il benessere giusto,
              <br />
              trovato in un <em>attimo.</em>
            </h1>
            <p className="hero-description">
              Prodotti selezionati, consigli chiari e assistenza vera. Tutto ciò
              che serve alla tua famiglia, senza complicazioni.
            </p>
            <form className="hero-search" onSubmit={runSearch}>
              <Search size={22} aria-hidden="true" />
              <label className="sr-only" htmlFor="hero-query">
                Cosa stai cercando?
              </label>
              <input
                id="hero-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cerca per nome, marca o bisogno"
              />
              <button type="submit">
                Trova subito <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
            <div className="quick-needs">
              <span>Ricerche frequenti:</span>
              {["Difese immunitarie", "Pelle sensibile", "Dolori muscolari"].map(
                (item) => (
                  <button key={item} onClick={() => setQuery(item)}>
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          <aside className="trust-card">
            <div className="trust-icon">
              <BadgeCheck size={24} aria-hidden="true" />
            </div>
            <p className="eyebrow">Un acquisto più sereno</p>
            <h2>La farmacia vicina, anche online.</h2>
            <p>
              Informazioni semplici, prodotti selezionati e persone disponibili
              prima e dopo l’ordine.
            </p>
            <ul>
              <li>
                <Check size={17} aria-hidden="true" /> Catalogo verificato
              </li>
              <li>
                <Check size={17} aria-hidden="true" /> Spedizioni tracciate
              </li>
              <li>
                <Check size={17} aria-hidden="true" /> Supporto via WhatsApp
              </li>
            </ul>
          </aside>
        </div>
        <div className="hero-rail">
          <div>
            <span>01</span>
            <p>Offerte fino al</p>
            <strong>−33%</strong>
          </div>
          <a href="/catalogo">
            Scopri la selezione <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="section shell" id="categorie">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Scelte più semplici</p>
            <h2>Trova subito ciò che ti serve.</h2>
          </div>
          <button
            className="text-link"
            onClick={() => setActiveCategory("Tutti")}
          >
            Tutte le categorie <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <a
              key={category.number}
              className="category-card"
              href="/catalogo"
            >
              <span>{category.number}</span>
              <div>
                <strong>{category.label}</strong>
                <small>{category.detail}</small>
              </div>
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="section products-section" id="prodotti">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Convenienza chiara</p>
              <h2>
                In evidenza, <em>questa settimana.</em>
              </h2>
            </div>
            <div className="filter-pills" aria-label="Filtra i prodotti">
              {["Tutti", "Integratori", "Igiene e cosmesi"].map((item) => (
                <button
                  key={item}
                  className={activeCategory === item ? "is-active" : ""}
                  onClick={() => setActiveCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="product-grid">
              {filteredProducts.map((product, index) => {
                const discount = Math.round(
                  (1 - product.price / product.regularPrice) * 100,
                );
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-visual">
                      <span className="product-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="discount-badge">
                        {product.badge || `−${discount}%`}
                      </span>
                      <button
                        className="favorite-button"
                        title={`Aggiungi ${product.shortName} ai preferiti`}
                        aria-label={`Aggiungi ${product.shortName} ai preferiti`}
                      >
                        <Heart size={19} aria-hidden="true" />
                      </button>
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-content">
                      <p>
                        {product.brand} · {product.category}
                      </p>
                      <h3>
                        <a href={`/prodotto/${product.slug}`}>{product.name}</a>
                      </h3>
                      <span className="need-label">{product.need}</span>
                      <div className="rating" aria-label="Valutazione 4,8 su 5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} fill="currentColor" />
                        ))}
                        <span>4,8</span>
                      </div>
                      <div className="price-row">
                        <div>
                          <del>{money.format(product.regularPrice)}</del>
                          <strong>{money.format(product.price)}</strong>
                        </div>
                        <button
                          className="add-button"
                          onClick={() => addToCart(product)}
                          aria-label={`Aggiungi ${product.shortName} al carrello`}
                          title="Aggiungi al carrello"
                        >
                          <Plus size={20} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-results">
              <Search size={28} aria-hidden="true" />
              <h3>Nessun prodotto trovato</h3>
              <p>Prova con un’altra parola o torna a tutti i prodotti.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("Tutti");
                }}
              >
                Mostra tutto
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section shell" id="fiducia">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Persone, non solo prodotti</p>
            <h2>La fiducia si costruisce nei dettagli.</h2>
          </div>
        </div>
        <div className="service-grid">
          <article className="service-feature feature-blue">
            <span>01</span>
            <ShieldCheck size={27} aria-hidden="true" />
            <h3>Acquisti protetti</h3>
            <p>Pagamenti sicuri e informazioni trasparenti in ogni passaggio.</p>
          </article>
          <article className="service-feature">
            <span>02</span>
            <PackageCheck size={27} aria-hidden="true" />
            <h3>Consegna su misura</h3>
            <p>GLS, BRT e Poste Italiane con tracciamento della spedizione.</p>
          </article>
          <article className="service-feature feature-green">
            <span>03</span>
            <Headphones size={27} aria-hidden="true" />
            <h3>Assistenza reale</h3>
            <p>Un aiuto semplice e veloce prima e dopo il tuo ordine.</p>
          </article>
        </div>
      </section>

      <section className="advice-section" id="consigli">
        <div className="shell advice-inner">
          <div>
            <p className="eyebrow">Nowpharma consiglia</p>
            <h2>Non sai da dove iniziare?</h2>
            <p>
              Parti dall’esigenza: ti aiutiamo a trovare una scelta più chiara
              per te e per la tua famiglia.
            </p>
          </div>
          <a className="light-button" href="https://wa.me/393515078701">
            Parla con noi su WhatsApp
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="brands shell section" id="marche">
        <p className="eyebrow">Marchi selezionati</p>
        <div className="brand-row">
          {["ESI", "RILASTIL", "BIOS LINE", "SWISSE", "LA ROCHE-POSAY"].map(
            (brand) => (
              <span key={brand}>{brand}</span>
            ),
          )}
        </div>
      </section>

      <footer>
        <div className="shell footer-main">
          <div className="footer-brand">
            <img src="/logo-nowpharma.png" alt="Nowpharma" />
            <p>
              Benessere quotidiano, scelte semplici e un’assistenza sempre
              vicina.
            </p>
          </div>
          <div>
            <h3>Esplora</h3>
            <a href="/catalogo">Categorie</a>
            <a href="#prodotti">Offerte</a>
            <a href="#marche">Marche</a>
            <a href="#consigli">Consigli</a>
          </div>
          <div>
            <h3>Assistenza</h3>
            <a href="#">Spedizioni</a>
            <a href="#">Pagamenti</a>
            <a href="#">Resi e rimborsi</a>
            <a href="#">Contatti</a>
          </div>
          <div>
            <h3>Pagamenti accettati</h3>
            <p className="footer-method">
              <CreditCard size={18} aria-hidden="true" /> Carta con Stripe
            </p>
            <p className="footer-method">
              <Banknote size={18} aria-hidden="true" /> Contrassegno
            </p>
            <p className="footer-method">
              <Building2 size={18} aria-hidden="true" /> Bonifico bancario
            </p>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2026 Nowpharma · VIPHARMA S.A.S.</span>
          <div>
            <a href="#">Privacy</a>
            <a href="#">Cookie</a>
            <a href="#">Termini e condizioni</a>
          </div>
        </div>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <Check size={18} aria-hidden="true" /> {notice}
        </div>
      )}

      {cartOpen && (
        <div className="drawer-layer" role="presentation">
          <button
            className="drawer-backdrop"
            aria-label="Chiudi il carrello"
            onClick={() => setCartOpen(false)}
          />
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Il tuo ordine</p>
                <h2 id="cart-title">Carrello</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Chiudi"
                title="Chiudi"
              >
                <X size={22} />
              </button>
            </div>

            {cartItems.length ? (
              <>
                <div className="shipping-progress">
                  <div>
                    <Truck size={18} aria-hidden="true" />
                    {freeShippingLeft > 0
                      ? `Ti mancano ${money.format(
                          freeShippingLeft,
                        )} per la spedizione gratuita`
                      : "Hai ottenuto la spedizione gratuita"}
                  </div>
                  <span>
                    <i
                      style={{
                        width: `${Math.min(100, (subtotal / 39.9) * 100)}%`,
                      }}
                    />
                  </span>
                </div>
                <div className="cart-lines">
                  {cartItems.map((item) => (
                    <article className="cart-line" key={item.id}>
                      <img src={item.image} alt="" />
                      <div>
                        <strong>{item.shortName}</strong>
                        <small>{money.format(item.price)}</small>
                        <div className="quantity">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Riduci quantità di ${item.shortName}`}
                          >
                            <Minus size={15} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Aumenta quantità di ${item.shortName}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                      <b>{money.format(item.price * item.quantity)}</b>
                    </article>
                  ))}
                </div>
                <div className="cart-summary">
                  <p>
                    <span>Subtotale</span>
                    <b>{money.format(subtotal)}</b>
                  </p>
                  <p>
                    <span>Spedizione</span>
                    <b>{shipping ? money.format(shipping) : "Gratuita"}</b>
                  </p>
                  <p className="cart-total">
                    <span>Totale</span>
                    <b>{money.format(subtotal + shipping)}</b>
                  </p>
                  <button
                    className="primary-button full-button"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Vai al pagamento <ArrowRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <ShoppingBag size={35} aria-hidden="true" />
                <h3>Il carrello è ancora vuoto</h3>
                <p>Aggiungi i prodotti che ti interessano: li troverai qui.</p>
                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  Continua gli acquisti
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="checkout-layer">
          <button
            className="drawer-backdrop"
            aria-label="Chiudi il pagamento"
            onClick={() => setCheckoutOpen(false)}
          />
          <section
            className="checkout-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Ultimo passaggio</p>
                <h2 id="checkout-title">Completa l’ordine</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Chiudi"
              >
                <X size={22} />
              </button>
            </div>

            {orderSent ? (
              <div className="order-success">
                <div>
                  <Check size={28} />
                </div>
                <h3>
                  {payment === "bank"
                    ? "Ordine registrato: completa il bonifico"
                    : "Richiesta d’ordine ricevuta"}
                </h3>
                {payment === "bank" ? (
                  <div className="bank-instructions">
                    <p>
                      <strong>Beneficiario</strong>
                      VIPHARMA DI TATULLI VITO &amp; CO. S.A.S.
                    </p>
                    <p>
                      <strong>IBAN</strong>
                      IT79E0306941384100000009837
                    </p>
                    <small>
                      Inserisci il numero d’ordine nella causale. La spedizione
                      partirà dopo l’accredito.
                    </small>
                  </div>
                ) : (
                  <p>
                    Il pagamento in contrassegno include il supplemento di €5,00.
                    Riceverai la conferma con i dati della spedizione.
                  </p>
                )}
                <button
                  className="primary-button"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setOrderSent(false);
                  }}
                >
                  Torna allo shop
                </button>
              </div>
            ) : (
              <form onSubmit={submitOrder}>
                <div className="checkout-fields">
                  <label>
                    Nome e cognome
                    <input required placeholder="Mario Rossi" />
                  </label>
                  <label>
                    Email
                    <input type="email" required placeholder="mario@email.it" />
                  </label>
                  <label className="field-wide">
                    Indirizzo di consegna
                    <input required placeholder="Via, numero civico, città e CAP" />
                  </label>
                </div>

                <fieldset className="payment-methods">
                  <legend>Metodo di pagamento</legend>
                  <label className={payment === "stripe" ? "is-active" : ""}>
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "stripe"}
                      onChange={() => setPayment("stripe")}
                    />
                    <CreditCard size={21} />
                    <span>
                      <strong>Carta con Stripe</strong>
                      <small>Pagamento protetto e immediato</small>
                    </span>
                  </label>
                  <label className={payment === "cod" ? "is-active" : ""}>
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                    />
                    <Banknote size={21} />
                    <span>
                      <strong>Contrassegno</strong>
                      <small>Supplemento di €5,00</small>
                    </span>
                  </label>
                  <label className={payment === "bank" ? "is-active" : ""}>
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "bank"}
                      onChange={() => setPayment("bank")}
                    />
                    <Building2 size={21} />
                    <span>
                      <strong>Bonifico bancario</strong>
                      <small>Coordinate dopo la conferma</small>
                    </span>
                  </label>
                </fieldset>

                <div className="checkout-total">
                  <p>
                    <span>Prodotti</span>
                    <b>{money.format(subtotal)}</b>
                  </p>
                  <p>
                    <span>Spedizione</span>
                    <b>{shipping ? money.format(shipping) : "Gratuita"}</b>
                  </p>
                  {codFee > 0 && (
                    <p>
                      <span>Contrassegno</span>
                      <b>{money.format(codFee)}</b>
                    </p>
                  )}
                  <p className="cart-total">
                    <span>Totale</span>
                    <b>{money.format(total)}</b>
                  </p>
                </div>
                {checkoutMessage && (
                  <p className="checkout-message" role="alert">
                    {checkoutMessage}
                  </p>
                )}
                <button
                  className="primary-button full-button"
                  type="submit"
                  disabled={processing}
                >
                  {processing ? "Collegamento sicuro…" : "Conferma e continua"}{" "}
                  {!processing && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
