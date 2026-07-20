// ============================================================
// 16 SANTIAGO STORE — Logica negozio (carrello + checkout)
// ============================================================

// ------------------------------------------------------------
// CONFIGURAZIONE NEGOZIO — modifica questi valori con i tuoi dati
// ------------------------------------------------------------
const STORE_CONFIG = {
  storeName: "16 Santiago Store",
  // Numero WhatsApp in formato internazionale SENZA "+" (es. 393331234567)
  whatsappNumber: "390000000000",
  // Email dove ricevere gli ordini
  orderEmail: "ordini@16santiagostore.it",
  // Link PayPal.Me (crealo gratis su paypal.me)
  paypalLink: "https://paypal.me/16santiagostore",
  // Dati per bonifico bancario
  bank: {
    intestatario: "16 Santiago Store",
    iban: "IT00 X000 0000 0000 0000 0000 000",
    causale: "Ordine 16 Santiago Store",
  },
  // Spedizione
  shippingCost: 5.9,
  freeShippingOver: 60,
  // Supplemento contrassegno (pagamento alla consegna)
  codFee: 3.0,
};

const CART_KEY = "santiago16_cart";

// ---------------- Utility ----------------
const fmt = (n) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function shippingFor(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= STORE_CONFIG.freeShippingOver ? 0 : STORE_CONFIG.shippingCost;
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.classList.toggle("is-empty", n === 0);
  });
}

function addToCart(productId, size, qty) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      size,
      qty,
    });
  }
  saveCart(cart);
  openCartDrawer();
}

function changeQty(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCartDrawer();
  if (document.getElementById("checkout-items")) renderCheckout();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartDrawer();
  if (document.getElementById("checkout-items")) renderCheckout();
}

// ---------------- Catalogo (index) ----------------
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="card" data-open-product="${p.id}">
      <div class="card__imgwrap">
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="card__body">
        <span class="card__cat">${p.category}</span>
        <h3 class="card__title">${p.name}</h3>
        <div class="card__price">
          ${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ""}
          <strong>${fmt(p.price)}</strong>
        </div>
        <button class="btn btn--dark card__btn" type="button">Scegli taglia</button>
      </div>
    </article>`
  ).join("");

  grid.querySelectorAll("[data-open-product]").forEach((card) => {
    card.addEventListener("click", () => openProductModal(card.dataset.openProduct));
  });
}

// ---------------- Modal prodotto ----------------
let modalState = { id: null, size: null, qty: 1 };

function openProductModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const modal = document.getElementById("product-modal");
  if (!p || !modal) return;
  modalState = { id, size: null, qty: 1 };

  document.getElementById("pm-img").src = p.img;
  document.getElementById("pm-img").alt = p.name;
  document.getElementById("pm-cat").textContent = p.category;
  document.getElementById("pm-name").textContent = p.name;
  document.getElementById("pm-desc").textContent = p.description;
  document.getElementById("pm-price").innerHTML = `${
    p.oldPrice ? `<s>${fmt(p.oldPrice)}</s> ` : ""
  }<strong>${fmt(p.price)}</strong>`;
  document.getElementById("pm-qty").textContent = "1";
  document.getElementById("pm-error").hidden = true;

  const sizesEl = document.getElementById("pm-sizes");
  sizesEl.innerHTML = p.sizes
    .map((s) => `<button type="button" class="size-btn" data-size="${s}">${s}</button>`)
    .join("");
  sizesEl.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalState.size = btn.dataset.size;
      sizesEl.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.getElementById("pm-error").hidden = true;
    });
  });

  modal.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

function initProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;
  modal.querySelectorAll("[data-close-modal]").forEach((el) =>
    el.addEventListener("click", closeProductModal)
  );
  document.getElementById("pm-minus").addEventListener("click", () => {
    modalState.qty = Math.max(1, modalState.qty - 1);
    document.getElementById("pm-qty").textContent = modalState.qty;
  });
  document.getElementById("pm-plus").addEventListener("click", () => {
    modalState.qty = Math.min(10, modalState.qty + 1);
    document.getElementById("pm-qty").textContent = modalState.qty;
  });
  document.getElementById("pm-add").addEventListener("click", () => {
    if (!modalState.size) {
      document.getElementById("pm-error").hidden = false;
      return;
    }
    addToCart(modalState.id, modalState.size, modalState.qty);
    closeProductModal();
  });
}

// ---------------- Drawer carrello ----------------
function openCartDrawer() {
  renderCartDrawer();
  const d = document.getElementById("cart-drawer");
  if (!d) return;
  d.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeCartDrawer() {
  const d = document.getElementById("cart-drawer");
  if (d) d.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

function renderCartDrawer() {
  const list = document.getElementById("cart-items");
  if (!list) return;
  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `<p class="cart-empty">Il carrello è vuoto.<br/>Dai un'occhiata ai nostri completi!</p>`;
  } else {
    list.innerHTML = cart
      .map(
        (i, idx) => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}" />
        <div class="cart-item__info">
          <strong>${i.name}</strong>
          <span>Taglia ${i.size} · ${fmt(i.price)}</span>
          <div class="qty-ctrl">
            <button type="button" aria-label="Diminuisci" data-qty-minus="${idx}">−</button>
            <span>${i.qty}</span>
            <button type="button" aria-label="Aumenta" data-qty-plus="${idx}">+</button>
            <button type="button" class="cart-item__remove" data-remove="${idx}">Rimuovi</button>
          </div>
        </div>
        <strong class="cart-item__total">${fmt(i.price * i.qty)}</strong>
      </div>`
      )
      .join("");
  }

  const subtotal = cartSubtotal();
  const ship = shippingFor(subtotal);
  document.getElementById("cart-subtotal").textContent = fmt(subtotal);
  document.getElementById("cart-shipping").textContent =
    subtotal === 0 ? "—" : ship === 0 ? "Gratis" : fmt(ship);
  document.getElementById("cart-total").textContent = fmt(subtotal + ship);
  document.getElementById("cart-checkout-btn").toggleAttribute("disabled", cart.length === 0);

  list.querySelectorAll("[data-qty-minus]").forEach((b) =>
    b.addEventListener("click", () => changeQty(+b.dataset.qtyMinus, -1))
  );
  list.querySelectorAll("[data-qty-plus]").forEach((b) =>
    b.addEventListener("click", () => changeQty(+b.dataset.qtyPlus, 1))
  );
  list.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => removeItem(+b.dataset.remove))
  );
}

function initCartDrawer() {
  const d = document.getElementById("cart-drawer");
  if (!d) return;
  document.querySelectorAll("[data-open-cart]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCartDrawer();
    })
  );
  d.querySelectorAll("[data-close-cart]").forEach((el) =>
    el.addEventListener("click", closeCartDrawer)
  );
}

// ---------------- Checkout ----------------
function renderCheckout() {
  const itemsEl = document.getElementById("checkout-items");
  if (!itemsEl) return;
  const cart = getCart();
  const subtotal = cartSubtotal();
  const method = document.querySelector('input[name="payment"]:checked')?.value;
  const ship = shippingFor(subtotal);
  const codFee = method === "contrassegno" && cart.length ? STORE_CONFIG.codFee : 0;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Il carrello è vuoto. <a href="index.html#shop">Torna allo shop</a>.</p>`;
  } else {
    itemsEl.innerHTML = cart
      .map(
        (i, idx) => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}" />
        <div class="cart-item__info">
          <strong>${i.name}</strong>
          <span>Taglia ${i.size} × ${i.qty}</span>
          <button type="button" class="cart-item__remove" data-remove="${idx}">Rimuovi</button>
        </div>
        <strong class="cart-item__total">${fmt(i.price * i.qty)}</strong>
      </div>`
      )
      .join("");
    itemsEl.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => removeItem(+b.dataset.remove))
    );
  }

  document.getElementById("co-subtotal").textContent = fmt(subtotal);
  document.getElementById("co-shipping").textContent =
    cart.length === 0 ? "—" : ship === 0 ? "Gratis" : fmt(ship);
  const codRow = document.getElementById("co-cod-row");
  codRow.hidden = codFee === 0;
  document.getElementById("co-cod").textContent = fmt(codFee);
  document.getElementById("co-total").textContent = fmt(subtotal + ship + codFee);

  document.getElementById("pay-info-bonifico").hidden = method !== "bonifico";
  document.getElementById("pay-info-paypal").hidden = method !== "paypal";
  document.getElementById("pay-info-contrassegno").hidden = method !== "contrassegno";
}

function buildOrderMessage(data, orderId) {
  const cart = getCart();
  const subtotal = cartSubtotal();
  const ship = shippingFor(subtotal);
  const codFee = data.payment === "contrassegno" ? STORE_CONFIG.codFee : 0;
  const lines = [
    `🛍️ NUOVO ORDINE ${orderId} — ${STORE_CONFIG.storeName}`,
    "",
    ...cart.map((i) => `• ${i.name} (taglia ${i.size}) × ${i.qty} = ${fmt(i.price * i.qty)}`),
    "",
    `Subtotale: ${fmt(subtotal)}`,
    `Spedizione: ${ship === 0 ? "Gratis" : fmt(ship)}`,
    ...(codFee ? [`Contrassegno: ${fmt(codFee)}`] : []),
    `TOTALE: ${fmt(subtotal + ship + codFee)}`,
    "",
    `Pagamento: ${data.payment.toUpperCase()}`,
    "",
    `Cliente: ${data.name}`,
    `Telefono: ${data.phone}`,
    `Email: ${data.email}`,
    `Indirizzo: ${data.address}, ${data.cap} ${data.city}`,
    ...(data.notes ? [`Note: ${data.notes}`] : []),
  ];
  return lines.join("\n");
}

function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  renderCheckout();
  document
    .querySelectorAll('input[name="payment"]')
    .forEach((r) => r.addEventListener("change", renderCheckout));

  // Mostra i dati configurati
  document.getElementById("bank-holder").textContent = STORE_CONFIG.bank.intestatario;
  document.getElementById("bank-iban").textContent = STORE_CONFIG.bank.iban;
  document.getElementById("bank-causale").textContent = STORE_CONFIG.bank.causale;
  const ppLink = document.getElementById("paypal-link");
  ppLink.href = STORE_CONFIG.paypalLink;
  ppLink.textContent = STORE_CONFIG.paypalLink.replace("https://", "");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (getCart().length === 0) return;
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const orderId = "#SS" + Date.now().toString().slice(-6);
    const message = buildOrderMessage(data, orderId);

    // Apri WhatsApp con il riepilogo ordine precompilato
    const wa = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(wa, "_blank");

    // Mostra conferma
    document.getElementById("checkout-main").hidden = true;
    const ok = document.getElementById("order-confirm");
    ok.hidden = false;
    document.getElementById("confirm-id").textContent = orderId;
    document.getElementById("confirm-email").textContent = data.email;
    const mailBody = encodeURIComponent(message);
    document.getElementById(
      "confirm-mailto"
    ).href = `mailto:${STORE_CONFIG.orderEmail}?subject=${encodeURIComponent(
      "Ordine " + orderId
    )}&body=${mailBody}`;
    document.getElementById("confirm-wa").href = wa;

    // Svuota carrello
    saveCart([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------------- Init ----------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderProducts();
  initProductModal();
  initCartDrawer();
  initCheckout();

  // Menu mobile
  const burger = document.getElementById("nav-toggle");
  if (burger) {
    burger.addEventListener("click", () =>
      document.getElementById("site-nav").classList.toggle("is-open")
    );
  }

  // Anno footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
