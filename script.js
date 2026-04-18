// ============================================================
// CONFIG — single source of truth for all business details
// ============================================================
const CONFIG = {
  whatsappNumber: "916370731900",
  businessName: "GreenPulp Egg Trays",
  address: "Kodala, Ganjam, Odisha, India",
  phoneDisplay: "+91 6370731900",
  phoneHref: "+916370731900",
  email: "roshanpolai07@gmail.com",
  hours: "Mon–Sat, 9:00 AM – 7:00 PM"
};

// ============================================================
// PRODUCTS
// FIX #2: Each product has a fallback image URL (Unsplash)
//         so if the local ./images/ file 404s the card still renders.
// ============================================================
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=70";

const products = [
  {
    id: "p30",
    name: "30-Cell Egg Tray",
    desc: "Our most popular variant, ideal for poultry farms and bulk distributors.",
    dims: "300 × 300 × 45 mm",
    capacity: "30 eggs",
    material: "Recycled molded pulp",
    moq: "500 units",
    image: "./images/egg-tray-30-n.webp",
    fallback: "https://images.unsplash.com/photo-1587486936738-78c499f5f5f9?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: "p12",
    name: "12-Cell Egg Carton",
    desc: "Compact retail-friendly carton suited for farm-to-shelf packaging.",
    dims: "220 × 120 × 42 mm",
    capacity: "12 eggs",
    material: "Recycled molded pulp",
    moq: "1,000 units",
    image: "./images/egg-tray-12.jpg",
    fallback: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: "p6",
    name: "6-Cell Egg Carton",
    desc: "Perfect for small retail packs and local market distribution.",
    dims: "150 × 100 × 40 mm",
    capacity: "6 eggs",
    material: "Recycled molded pulp",
    moq: "2,000 units",
    image: "./images/egg-tray-6.jpg",
    fallback: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=600&q=70"
  }
];

// ============================================================
// WHATSAPP HELPERS
// FIX #1: All CTAs now produce real WhatsApp deep-links
// ============================================================
function makeWhatsAppLink(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getGeneralQuoteMessage() {
  return `Hi, I'm interested in your egg trays. Please share pricing for bulk quantity.`;
}

function getProductInquiryMessage(productName) {
  return `Hi, I'm interested in your ${productName}. Please share pricing and MOQ details.`;
}

// ============================================================
// DOM REFS — safely grabbed with null checks
// ============================================================
const productGrid   = document.getElementById("productGrid");
const dialog        = document.getElementById("productDialog");
const dialogClose   = document.getElementById("dialogClose");
const yearEl        = document.getElementById("year");
const menuToggle    = document.getElementById("menuToggle");
const navPanel      = document.getElementById("navPanel");

// IDs of every general quote CTA on the page
const quoteCTAIds = [
  "heroQuoteCta",
  "headerWhatsAppCta",
  "mobileWhatsAppCta",
  "contactWhatsAppCta",
  "floatingWhatsApp"
];

// ============================================================
// CONTACT DETAILS — keep in sync with CONFIG
// ============================================================
function applyBusinessDetails() {
  const addressEl = document.getElementById("contactAddress");
  if (addressEl) addressEl.textContent = CONFIG.address;

  const phoneEl = document.getElementById("contactPhone");
  if (phoneEl) {
    phoneEl.textContent = CONFIG.phoneDisplay;
    phoneEl.href = `tel:${CONFIG.phoneHref}`;
  }

  const emailEl = document.getElementById("contactEmail");
  if (emailEl) {
    emailEl.textContent = CONFIG.email;
    emailEl.href = `mailto:${CONFIG.email}`;
  }

  const hoursEl = document.getElementById("contactHours");
  if (hoursEl) hoursEl.textContent = CONFIG.hours;
}

// ============================================================
// UPDATE ALL WHATSAPP CTAs
// FIX #1: Was setting href="#" — now sets the real deep-link
// ============================================================
function updateQuoteCtas() {
  const link = makeWhatsAppLink(getGeneralQuoteMessage());
  quoteCTAIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = link;
  });
}

// ============================================================
// RENDER PRODUCTS
// FIX #2: onerror fallback on each product image
// FIX #2: Product cards were empty on Vercel because local images 404'd
// ============================================================
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View details for ${item.name}`);

    card.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.name}"
        loading="lazy"
        onerror="this.src='${item.fallback || FALLBACK_IMAGE}'; this.onerror=null;"
      />
      <h3>${item.name}</h3>
      <div class="product-meta">
        <span><strong>Capacity:</strong> ${item.capacity}</span>
        <span><strong>Dimensions:</strong> ${item.dims}</span>
        <span><strong>Material:</strong> ${item.material}</span>
        <span><strong>MOQ:</strong> ${item.moq}</span>
      </div>
      <p class="product-link"><a href="#" tabindex="-1">View details →</a></p>
    `;

    card.addEventListener("click", () => openProductDialog(item));
    // Keyboard accessibility — open dialog on Enter/Space
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProductDialog(item);
      }
    });

    productGrid.appendChild(card);
  });
}

// ============================================================
// PRODUCT DIALOG
// FIX #17: dialogImage src set explicitly so no stale 404 on page load
// ============================================================
function openProductDialog(item) {
  const imgEl = document.getElementById("dialogImage");
  if (imgEl) {
    imgEl.src = item.image;
    imgEl.alt = item.name;
    imgEl.onerror = function () {
      this.src = item.fallback || FALLBACK_IMAGE;
      this.onerror = null;
    };
  }

  const nameEl = document.getElementById("dialogName");
  if (nameEl) nameEl.textContent = item.name;

  const descEl = document.getElementById("dialogDesc");
  if (descEl) descEl.textContent = item.desc || "";

  const specsEl = document.getElementById("dialogSpecs");
  if (specsEl) {
    specsEl.innerHTML = `
      <li><strong>Dimensions:</strong> ${item.dims}</li>
      <li><strong>Capacity:</strong> ${item.capacity}</li>
      <li><strong>Material:</strong> ${item.material}</li>
      <li><strong>Min. Order:</strong> ${item.moq}</li>
    `;
  }

  const waEl = document.getElementById("dialogWhatsApp");
  if (waEl) waEl.href = makeWhatsAppLink(getProductInquiryMessage(item.name));

  if (dialog) dialog.showModal();
}

// ============================================================
// INTERSECTION OBSERVER — fade-in on scroll
// ============================================================
function setupFadeIn() {
  if (!("IntersectionObserver" in window)) {
    // Fallback: just make everything visible
    document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop watching once visible
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

// ============================================================
// MOBILE MENU TOGGLE
// ============================================================
function toggleMobileMenu(force) {
  if (!navPanel || !menuToggle) return;
  const open = typeof force === "boolean" ? force : !navPanel.classList.contains("open");
  navPanel.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  // Update icon
  const icon = menuToggle.querySelector("i");
  if (icon) {
    icon.className = open ? "fas fa-times" : "fas fa-bars";
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => toggleMobileMenu());
}

// Close mobile menu when a nav link is clicked
document.querySelectorAll(".nav-links a, .nav-panel-links a").forEach((el) => {
  el.addEventListener("click", () => toggleMobileMenu(false));
});

// ============================================================
// DIALOG CLOSE HANDLERS
// ============================================================
if (dialogClose) {
  dialogClose.addEventListener("click", () => {
    if (dialog) dialog.close();
  });
}

// Close dialog on backdrop click
if (dialog) {
  dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) dialog.close();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleMobileMenu(false);
    // dialog handles Escape natively, but just in case:
    if (dialog && dialog.open) dialog.close();
  }
});

// ============================================================
// FIX #11: Footer subscribe — JS handler, no page jump
// ============================================================
const footerSubscribeBtn = document.getElementById("footerSubscribeBtn");
const footerEmailInput   = document.getElementById("footerEmail");
const footerSubscribeMsg = document.getElementById("footerSubscribeMsg");

if (footerSubscribeBtn) {
  footerSubscribeBtn.addEventListener("click", () => {
    const email = footerEmailInput ? footerEmailInput.value.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (footerSubscribeMsg) {
        footerSubscribeMsg.textContent = "Please enter a valid email address.";
        footerSubscribeMsg.style.color = "#f4a261";
        footerSubscribeMsg.hidden = false;
      }
      return;
    }
    // In production, send to your email service here.
    if (footerSubscribeMsg) {
      footerSubscribeMsg.textContent = "Thanks! We'll be in touch.";
      footerSubscribeMsg.style.color = "#a8d8bc";
      footerSubscribeMsg.hidden = false;
    }
    if (footerEmailInput) footerEmailInput.value = "";
  });
}

// ============================================================
// FIX #20: Copyright year — JS sets it; HTML has static fallback "2025"
// ============================================================
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ============================================================
// INIT
// ============================================================
applyBusinessDetails();
updateQuoteCtas();
renderProducts();
setupFadeIn();
