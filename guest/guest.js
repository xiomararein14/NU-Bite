let menu = [];

const FALLBACK_IMG = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180">' +
  '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
  '<stop offset="0%" style="stop-color:#dbeafe"/><stop offset="100%" style="stop-color:#fef3c7"/>' +
  '</linearGradient></defs><rect fill="url(#g)" width="300" height="180"/>' +
  '<g transform="translate(150,90)" stroke="#003DA5" stroke-width="3" stroke-linecap="round" fill="none">' +
  '<path d="M-14-10v20"/><path d="M0-14v26"/><path d="M14-10v20"/></g></svg>'
);

let cart = [];
let selectedCategory = "All";
let selectedStall = 1;
let cartStall = null;

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function updateCategoryCounts() {
  const categories = ["All", "Breakfast", "Lunch", "Drinks"];
  const stallMenu = typeof getMenuByStall === "function" ? getMenuByStall(selectedStall) : menu;
  categories.forEach(cat => {
    const count = cat === "All"
      ? stallMenu.length
      : stallMenu.filter(item => item.category === cat).length;
    const btn = document.querySelector(`.category[data-cat="${cat}"] .cat-count`);
    if (btn) btn.textContent = `${count} item${count !== 1 ? "s" : ""}`;
  });
}

function updateStallTitle() {
  const title = document.getElementById("stallMenuTitle");
  if (title && typeof getStallName === "function") {
    title.textContent = `${getStallName(selectedStall)} Menu`;
  }
}

function selectStall(stallId, btn) {
  if (cart.length && cartStall !== null && cartStall !== stallId) {
    if (!confirm("Switching stalls will clear your cart. Orders must be from one stall only. Continue?")) {
      return;
    }
    cart = [];
    cartStall = null;
    displayCart();
  }

  selectedStall = stallId;
  document.querySelectorAll(".stall-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  updateStallTitle();
  updateCategoryCounts();
  displayMenu();
}

function refreshMenu() {
  menu = typeof getMenuByStall === "function"
    ? getMenuByStall(selectedStall)
    : (typeof getMenu === "function" ? getMenu() : []);
}

function displayMenu() {
  refreshMenu();
  const grid = document.getElementById("menuGrid");
  const search = document.getElementById("searchFood").value.toLowerCase();
  let visibleCount = 0;

  grid.innerHTML = "";

  menu.forEach((item) => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(search);

    if (categoryMatch && searchMatch) {
      visibleCount++;
      const badge = item.popular ? '<span class="food-badge">Popular</span>' : "";

      grid.innerHTML += `
        <div class="food-card">
          <div class="food-card-image">
            ${badge}
            <img src="${item.img}" alt="${item.name}" onerror="this.src='${FALLBACK_IMG}'">
          </div>
          <h3>${item.name}</h3>
          <p class="food-category">${item.category}</p>
          <div class="food-bottom">
            <b>₱${item.price}</b>
            <button onclick="addToCart('${item.id}')">+ Add</button>
          </div>
        </div>
      `;
    }
  });

  const menuCount = document.getElementById("menuCount");
  if (menuCount) {
    menuCount.textContent = visibleCount
      ? `Showing ${visibleCount} item${visibleCount !== 1 ? "s" : ""}`
      : "No items found";
  }
}

function filterCategory(category) {
  selectedCategory = category;
  document.querySelectorAll(".category").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");
  displayMenu();
}

function addToCart(itemId) {
  const item = menu.find(m => m.id === itemId);
  if (!item) return;

  if (cartStall !== null && cartStall !== selectedStall) {
    showToast("Your cart is from another stall. Clear it or finish that order first.", "warning");
    return;
  }

  const existingItem = cart.find(cartItem => cartItem.id === item.id || cartItem.name === item.name);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ ...item, quantity: 1 });

  cartStall = selectedStall;
  showToast(`${item.name} added to cart`, "success");
  displayCart();
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  displayCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) cart[index].quantity -= 1;
  else cart.splice(index, 1);
  if (cart.length === 0) cartStall = null;
  displayCart();
}

function removeItem(index) {
  const name = cart[index].name;
  cart.splice(index, 1);
  if (cart.length === 0) cartStall = null;
  showToast(`${name} removed from cart`, "warning");
  displayCart();
}

function displayCart() {
  const cartItems = document.getElementById("cartItems");
  const totalText = document.getElementById("total");
  const cartCount = document.getElementById("cartCount");

  let total = 0;
  let itemCount = 0;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartStall = null;
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${typeof icon === "function" ? icon("cart", "icon icon-lg") : ""}</div>
        <h3>Your cart is empty</h3>
        <p>Browse the menu and add your favorite campus meals.</p>
      </div>
    `;
    totalText.innerText = "₱0";
    cartCount.textContent = "0";
    return;
  }

  const stallLabel = typeof getStallName === "function" ? getStallName(cartStall) : `Stall ${cartStall}`;
  cartItems.innerHTML = `<p class="cart-stall-tag">Ordering from ${stallLabel}</p>`;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img class="cart-item-thumb" src="${item.img}" alt="${item.name}" onerror="this.src='${FALLBACK_IMG}'">
        <div class="cart-item-body">
          <h4>${item.name}</h4>
          <p>₱${item.price} each</p>
          <span class="item-subtotal">₱${itemTotal}</span>
        </div>
        <div class="qty-controls">
          <button onclick="decreaseQuantity(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">Remove item</button>
      </div>
    `;
  });

  totalText.innerText = "₱" + total;
  cartCount.textContent = itemCount;
}

function renderOrderRecap() {
  const recap = document.getElementById("orderRecap");
  if (!recap) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsHTML = cart.map(item =>
    `<li><span>${item.name} × ${item.quantity}</span><span>₱${item.price * item.quantity}</span></li>`
  ).join("");

  recap.innerHTML = `
    <h4>Order Summary</h4>
    <ul>${itemsHTML}</ul>
    <li style="margin-top:10px;font-weight:800;color:#003DA5;display:flex;justify-content:space-between;">
      <span>Total</span><span>₱${total}</span>
    </li>
  `;
}

function checkout() {
  if (cart.length === 0) {
    showToast("Add food to your cart first", "warning");
    return;
  }
  renderOrderRecap();
  showTab("paymentTab");
}

function payNow() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = "NU" + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    id: orderId,
    role: "Guest",
    stall: cartStall,
    stallName: typeof getStallName === "function" ? getStallName(cartStall) : `Stall ${cartStall}`,
    items: cart,
    total: total,
    payment: "Cash on Pickup",
    status: "Preparing",
    date: now.toISOString().split("T")[0],
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("latestOrderId", orderId);

  cart = [];
  cartStall = null;
  displayCart();
  showToast(`Order #${orderId} placed successfully!`, "success");

  updateTrackingFromStorage();
  showTab("trackTab", document.querySelectorAll(".nav-btn")[1]);
}

function showTab(tabId, clickedBtn) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  if (clickedBtn) clickedBtn.classList.add("active");

  if (tabId === "aboutTab" && typeof mountAboutPage === "function") mountAboutPage("aboutMount");
  if (tabId === "featuresTab" && typeof mountFeaturesPage === "function") mountFeaturesPage("featuresMount");
  if (tabId === "feedbackTab" && typeof mountFeedbackForm === "function") mountFeedbackForm("feedbackMount");
  if (typeof renderIcons === "function") renderIcons(document.getElementById(tabId) || document);
}

function updateTrackingFromStorage() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const trackTab = document.getElementById("trackTab");

  if (orders.length === 0) {
    trackTab.innerHTML = `
      <div class="empty-track">
        <h1>No Orders Yet</h1>
        <p>You haven't placed any orders. Add food to your cart and checkout to track your meal here.</p>
        <button onclick="showTab('menuTab', document.querySelectorAll('.nav-btn')[0])">Browse Menu</button>
      </div>
    `;
    return;
  }

  trackTab.innerHTML = `<div class="orders-list"></div>`;
  const ordersList = trackTab.querySelector(".orders-list");

  orders.slice().reverse().forEach(order => {
    let step3 = "";
    let step4 = "";
    let fillClass = "";

    if (order.status === "Preparing") step3 = "active";
    if (order.status === "Ready to Pick Up" || order.status === "Picked Up") {
      step3 = "active";
      step4 = "active";
      fillClass = "full";
    }

    const itemsHTML = (order.items || []).map(item =>
      `<li>${item.name} × ${item.quantity}</li>`
    ).join("");

    ordersList.innerHTML += `
      <div class="track-card">
        <div class="track-header">
          <div>
            <p>ORDER <span>#${order.id}</span></p>
            <small>${order.date || ""} · ${order.time || ""}</small>
          </div>
          <div>
            <p>Status</p>
            <strong>${order.status}</strong>
          </div>
        </div>
        <div class="progress-line">
          <div class="progress-fill ${fillClass}"></div>
          <div class="track-step active"><span>${trackStepIcon(true)}</span><p>Order Placed</p></div>
          <div class="track-step active"><span>${trackStepIcon(true)}</span><p>Payment</p></div>
          <div class="track-step ${step3}"><span>${trackStepIcon(!!step3)}</span><p>Preparing</p></div>
          <div class="track-step ${step4}"><span>${trackStepIcon(!!step4)}</span><p>Ready to Pick Up</p></div>
        </div>
        <div class="track-summary">
          <h2>${order.status}</h2>
          <p>Total: ₱${order.total} · ${order.payment}</p>
          <ul>${itemsHTML}</ul>
        </div>
      </div>
    `;
  });

  if (typeof renderIcons === "function") renderIcons(trackTab);
}

function logout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  location.href = "../login/login.html";
}

refreshMenu();
updateStallTitle();
updateCategoryCounts();
displayMenu();
displayCart();
updateTrackingFromStorage();
setInterval(updateTrackingFromStorage, 1000);

window.addEventListener("storage", (e) => {
  if (e.key === "nubite_menu" || e.key === "nubite_menu_version") {
    refreshMenu();
    updateCategoryCounts();
    displayMenu();
  }
});
