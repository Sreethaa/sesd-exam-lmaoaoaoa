"use strict";

const products = [
  { id: "sneakers", name: "Sunday Sneakers", category: "Clothing", price: 3290, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80", alt: "Bright red low-top sneaker", tag: "BESTSELLER" },
  { id: "headphones", name: "On-the-Go Headphones", category: "Electronics", price: 4590, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80", alt: "Classic over-ear headphones", tag: "GOOD SOUND" },
  { id: "tote", name: "Everywhere Tote", category: "Accessories", price: 1890, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80", alt: "Structured tan leather handbag", tag: "JUST IN" },
  { id: "watch", name: "The Slow Hour Watch", category: "Accessories", price: 2790, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80", alt: "Minimal wristwatch with a light dial", tag: "TIMELESS" },
  { id: "tee", name: "Easy Days Tee", category: "Clothing", price: 990, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80", alt: "Relaxed white cotton t-shirt", tag: "EVERYDAY" },
  { id: "sunglasses", name: "Golden Hour Shades", category: "Accessories", price: 1490, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80", alt: "Tortoiseshell sunglasses in warm sunlight", tag: "SUNNY DAYS" },
  { id: "backpack", name: "Little Elsewhere Backpack", category: "Accessories", price: 2490, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80", alt: "Compact everyday backpack", tag: "ON THE MOVE" },
  { id: "lamp", name: "Soft Glow Desk Lamp", category: "Home & Living", price: 2190, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80", alt: "Warm modern desk lamp", tag: "DESK FAVORITE" }
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const productGrid = document.querySelector("#product-grid");
const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const cartSubtotal = document.querySelector("#cart-subtotal");
const drawerCount = document.querySelector("#drawer-count");
const cartDrawer = document.querySelector("#cart-drawer");
const cartBackdrop = document.querySelector("#cart-backdrop");
const cartTrigger = document.querySelector("#cart-trigger");
const toast = document.querySelector("#toast");
const noProducts = document.querySelector("#no-products");

let cart = loadCart();
let toastTimer;
let lastFocusedElement;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("shopora-cart") || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter(([id, quantity]) =>
        products.some((product) => product.id === id) &&
        Number.isInteger(quantity) && quantity > 0
      )
    );
  } catch (error) {
    console.warn("Could not read the saved SHOPORA cart.", error);
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("shopora-cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Could not save the SHOPORA cart in this browser.", error);
  }
}

function renderProducts(filter = "All") {
  const visibleProducts = filter === "All"
    ? products
    : products.filter((product) => product.category === filter);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <div><h3>${product.name}</h3><p class="product-category">${product.category}</p></div>
        <p class="product-price">${currency.format(product.price)}</p>
      </div>
      <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag">ADD TO BAG&nbsp; +</button>
    </article>
  `).join("");
  noProducts.hidden = visibleProducts.length !== 0;
}

function getCartQuantity() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function renderCart() {
  const entries = products.filter((product) => cart[product.id]);
  const quantity = getCartQuantity();
  const subtotal = entries.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  cartCount.textContent = String(quantity);
  cartTrigger.setAttribute("aria-label", `Open shopping bag, ${quantity} ${quantity === 1 ? "item" : "items"}`);
  drawerCount.textContent = `(${quantity})`;
  cartSubtotal.textContent = currency.format(subtotal);
  cartEmpty.classList.toggle("is-visible", entries.length === 0);
  cartItems.classList.toggle("is-empty", entries.length === 0);
  cartFooter.classList.toggle("is-hidden", entries.length === 0);

  cartItems.innerHTML = entries.map((product) => `
    <article class="cart-line">
      <img src="${product.image}" alt="${product.alt}">
      <div class="cart-line-info">
        <h3>${product.name}</h3>
        <p>${currency.format(product.price)} each</p>
        <div class="quantity-control" aria-label="${product.name} quantity">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button>
          <span>${cart[product.id]}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button>
        </div>
      </div>
      <div class="cart-line-end">
        <strong>${currency.format(product.price * cart[product.id])}</strong>
        <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remove ${product.name} from bag">Remove</button>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("is-open", isOpen);
  cartBackdrop.hidden = !isOpen;
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("cart-open", isOpen);
  if (isOpen) {
    lastFocusedElement = document.activeElement;
    document.querySelector("#close-cart").focus();
  } else if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

document.querySelector(".filter-row").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll(".filter-button").forEach((filterButton) => {
    const isActive = filterButton === button;
    filterButton.classList.toggle("is-active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts(button.dataset.filter);
});

document.querySelector(".category-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  const filterButton = [...document.querySelectorAll(".filter-button")]
    .find((filter) => filter.dataset.filter === button.dataset.category);
  filterButton.click();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.add);
  if (!product) return;
  cart[product.id] = (cart[product.id] || 0) + 1;
  saveCart();
  renderCart();
  showToast(`${product.name} added to your bag`);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    cart[id] += Number(quantityButton.dataset.change);
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveCart();
    renderCart();
    showToast("Item removed from your bag");
  }
});

cartTrigger.addEventListener("click", () => setCartOpen(true));
document.querySelector("#close-cart").addEventListener("click", () => setCartOpen(false));
cartBackdrop.addEventListener("click", () => setCartOpen(false));
document.querySelector(".continue-shopping").addEventListener("click", () => setCartOpen(false));
document.querySelector("#checkout-button").addEventListener("click", () => {
  showToast("This demo has no payment — your bag is ready!");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) setCartOpen(false);
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", isOpen);
});
navigation.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#newsletter-message").textContent = "Thanks for stopping by! Newsletter signup is a demo.";
  event.currentTarget.reset();
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
renderProducts();
renderCart();
