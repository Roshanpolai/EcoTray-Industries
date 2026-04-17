// CONFIG
const CONFIG = {
  whatsappNumber: "916370731900",
  businessName: "GreenPulp Egg Trays",
  address: "Kodala, Ganjam, Odisha, India",
  phoneDisplay: "+91 6370731900",
  phoneHref: "+916370731900",
  email: "roshanpolai07@gmail.com",
  hours: "Mon-Sat, 9:00 AM - 7:00 PM"
};

// PRODUCTS
const products = [
  {
    id: "p30",
    name: "30-Cell Egg Tray",
    dims: "300 x 300 x 45 mm",
    capacity: "30 eggs",
    material: "Recycled molded pulp",
    image: "./images/egg-tray-30-n.webp"
  },
  {
    id: "p12",
    name: "12-Cell Egg Carton",
    dims: "220 x 120 x 42 mm",
    capacity: "12 eggs",
    material: "Recycled molded pulp",
    image: "./images/egg-tray-12.jpg"
  },
  {
    id: "p6",
    name: "6-Cell Egg Carton",
    dims: "150 x 100 x 40 mm",
    capacity: "6 eggs",
    material: "Recycled molded pulp",
    image: "./images/egg-tray-6.jpg"
  }
];

// WHATSAPP
function makeWhatsAppLink(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getGeneralQuoteMessage() {
  return "Hi, I'm interested in your egg trays. Please share pricing for bulk quantity.";
}

function getProductInquiryMessage(productName) {
  return `Hi, I'm interested in your ${productName}. Please share pricing for quantity.`;
}

// DOM
const productGrid = document.getElementById("productGrid");
const dialog = document.getElementById("productDialog");
const dialogClose = document.getElementById("dialogClose");
const year = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const navPanel = document.getElementById("navPanel");

const ctaIds = [
  "heroQuoteCta",
  "headerWhatsAppCta",
  "mobileWhatsAppCta",
  "contactWhatsAppCta",
  "floatingWhatsApp"
];

// CONTACT
function applyBusinessDetails() {
  document.getElementById("contactAddress").textContent = CONFIG.address;

  const phoneEl = document.getElementById("contactPhone");
  phoneEl.textContent = CONFIG.phoneDisplay;
  phoneEl.href = `tel:${CONFIG.phoneHref}`;

  const emailEl = document.getElementById("contactEmail");
  emailEl.textContent = CONFIG.email;
  emailEl.href = `mailto:${CONFIG.email}`;

  document.getElementById("contactHours").textContent = CONFIG.hours;
}

// WHATSAPP CTA
function updateQuoteCtas() {
  const link = makeWhatsAppLink(getGeneralQuoteMessage());
  ctaIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = link;
  });
}

// PRODUCTS RENDER
function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <div class="product-meta">
        <span><strong>Dimensions:</strong> ${item.dims}</span>
        <span><strong>Capacity:</strong> ${item.capacity}</span>
        <span><strong>Material:</strong> ${item.material}</span>
      </div>
      <p class="product-link"><a href="#">View details</a></p>
    `;

    card.addEventListener("click", () => openProductDialog(item));
    productGrid.appendChild(card);
  });
}

// DIALOG
function openProductDialog(item) {
  document.getElementById("dialogImage").src = item.image;
  document.getElementById("dialogImage").alt = item.name;
  document.getElementById("dialogName").textContent = item.name;

  document.getElementById("dialogDesc").textContent = "";

  document.getElementById("dialogSpecs").innerHTML = `
    <li><strong>Dimensions:</strong> ${item.dims}</li>
    <li><strong>Capacity:</strong> ${item.capacity}</li>
    <li><strong>Material:</strong> ${item.material}</li>
  `;

  document.getElementById("dialogWhatsApp").href =
    makeWhatsAppLink(getProductInquiryMessage(item.name));

  dialog.showModal();
}

// ANIMATION
function setupFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

// MENU
function toggleMobileMenu(force) {
  const open = typeof force === "boolean" ? force : !navPanel.classList.contains("open");
  navPanel.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", open);
}

menuToggle.addEventListener("click", () => toggleMobileMenu());

document.querySelectorAll(".nav-links a, .nav-panel-links a").forEach((el) => {
  el.addEventListener("click", () => toggleMobileMenu(false));
});

// CLOSE HANDLERS
dialogClose.addEventListener("click", () => dialog.close());

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleMobileMenu(false);
    if (dialog.open) dialog.close();
  }
});

// INIT
year.textContent = new Date().getFullYear();
applyBusinessDetails();
updateQuoteCtas();
renderProducts();
setupFadeIn();