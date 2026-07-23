"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

export function AddToCart({
  id,
  name,
  inStock,
}: {
  id: string;
  name: string;
  inStock: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    const cart = JSON.parse(
      window.localStorage.getItem("nowpharma-cart") || "{}",
    ) as Record<string, number>;
    cart[id] = (cart[id] || 0) + quantity;
    window.localStorage.setItem("nowpharma-cart", JSON.stringify(cart));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  if (!inStock) {
    return (
      <button className="product-unavailable" disabled>
        Momentaneamente non disponibile
      </button>
    );
  }

  return (
    <div className="product-add-area">
      <div className="product-quantity">
        <button
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          aria-label="Riduci quantità"
        >
          <Minus size={17} />
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity((current) => Math.min(20, current + 1))}
          aria-label="Aumenta quantità"
        >
          <Plus size={17} />
        </button>
      </div>
      <button className="product-add-main" onClick={add}>
        {added ? <Check size={19} /> : <ShoppingBag size={19} />}
        {added ? "Aggiunto al carrello" : `Aggiungi ${quantity} al carrello`}
      </button>
    </div>
  );
}

