let adminSession = null;

function initStallDashboard() {
  adminSession = requireAdminAuth();
  if (!adminSession) return;

  const brandSub = document.getElementById("adminBrandSub");
  const panelSub = document.getElementById("panelSubtitle");
  const stallBadge = document.getElementById("stallAdminBadge");

  if (brandSub) brandSub.textContent = `${adminSession.stallName} Dashboard`;
  if (panelSub) panelSub.textContent = `Manage ${adminSession.stallName} orders and menu only.`;
  if (stallBadge) stallBadge.textContent = adminSession.stallName;

  const stallFilter = document.getElementById("menuStallFilter");
  if (stallFilter) stallFilter.style.display = "none";

  const stallField = document.getElementById("menuStallField");
  if (stallField) {
    stallField.innerHTML = `<p class="menu-form-hint">New items will be assigned to <strong>${adminSession.stallName}</strong> only.</p>`;
  }

  loadOrders();
}

function loadOrders() {
  if (!adminSession) return;

  const orders = filterOrdersForAdmin(JSON.parse(localStorage.getItem("orders")) || []);
  const pendingContainer = document.getElementById("ordersContainer");
  const completedContainer = document.getElementById("completedContainer");
  const dateFilter = document.getElementById("dateFilter").value;
  const searchOrder = document.getElementById("searchOrder").value.toLowerCase();

  pendingContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  let filteredOrders = orders.filter(order => {
    const matchesDate = !dateFilter || order.date === dateFilter;
    const matchesSearch = !searchOrder || order.id.toLowerCase().includes(searchOrder);
    return matchesDate && matchesSearch;
  });

  const pendingOrders = filteredOrders.filter(order => order.status !== "Picked Up");
  const completedOrders = filteredOrders.filter(order => order.status === "Picked Up");

  document.getElementById("statPending").textContent = pendingOrders.length;
  document.getElementById("statCompleted").textContent = completedOrders.length;

  const stallLabel = adminSession.stallName;

  if (pendingOrders.length === 0) {
    pendingContainer.innerHTML = typeof emptyStateMessage === "function"
      ? emptyStateMessage(`No pending orders for ${stallLabel}.`)
      : `<p class='empty-message'>No pending orders for ${stallLabel}.</p>`;
  }

  pendingOrders.forEach(order => {
    pendingContainer.innerHTML += orderCard(order, false);
  });

  if (completedOrders.length === 0) {
    completedContainer.innerHTML = typeof emptyStateMessage === "function"
      ? emptyStateMessage(`No completed orders for ${stallLabel}.`)
      : `<p class='empty-message'>No completed orders for ${stallLabel}.</p>`;
  }

  completedOrders.forEach(order => {
    completedContainer.innerHTML += orderCard(order, true);
  });

  if (typeof renderIcons === "function") renderIcons(document.querySelector(".main-panel"));
}

function orderCard(order, completed) {
  const itemsHTML = (order.items || []).map(item =>
    `<li>${item.name} × ${item.quantity} — ₱${item.price * item.quantity}</li>`
  ).join("");

  return `
    <div class="order-card">
      <div class="order-top">
        <div>
          <h3>Order #${order.id}</h3>
          <p>${order.date || "No date"} · ${order.time || "No time"}${order.role ? ` · ${order.role}` : ""}</p>
        </div>
        <span class="status-pill ${statusClass(order.status)}">${order.status}</span>
      </div>

      <p><b>Payment:</b> ${order.payment || "N/A"} · <b>Total:</b> ₱${order.total}</p>

      <div class="items-box">
        <b>Items Ordered</b>
        <ul>${itemsHTML || "<li>No item details.</li>"}</ul>
      </div>

      ${completed ? "" : `
        <div class="actions">
          <button class="prep" onclick="updateStatus('${order.id}', 'Preparing')">Preparing</button>
          <button class="ready" onclick="updateStatus('${order.id}', 'Ready to Pick Up')">Ready</button>
          <button class="picked" onclick="updateStatus('${order.id}', 'Picked Up')">Picked Up</button>
        </div>
      `}
    </div>
  `;
}

function statusClass(status) {
  if (status === "Preparing") return "status-preparing";
  if (status === "Ready to Pick Up") return "status-ready";
  if (status === "Picked Up") return "status-picked";
  return "";
}

function updateStatus(orderId, status) {
  const stallId = getAdminStallId();
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find(o => o.id === orderId);

  if (!order || !orderBelongsToStall(order, stallId)) {
    alert("You can only update orders for your stall.");
    return;
  }

  order.status = status;

  if (status === "Picked Up") {
    const now = new Date();
    order.completedDate = now.toISOString().split("T")[0];
    order.completedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
  if (document.getElementById("reportsTab")?.style.display === "block") {
    loadStallReports();
  }
}

function showAdminTab(tab, button) {
  const isInfoPage = tab === "about" || tab === "features";
  const isMenuPage = tab === "menu";
  const isReportsPage = tab === "reports";
  const isFeedbackPage = tab === "feedback";
  const hideOrderPanel = isInfoPage || isMenuPage || isReportsPage || isFeedbackPage;

  document.getElementById("pendingTab").style.display = tab === "pending" ? "block" : "none";
  document.getElementById("completedTab").style.display = tab === "completed" ? "block" : "none";
  document.getElementById("aboutTab").style.display = tab === "about" ? "block" : "none";
  document.getElementById("featuresTab").style.display = tab === "features" ? "block" : "none";
  document.getElementById("menuTab").style.display = isMenuPage ? "block" : "none";
  document.getElementById("reportsTab").style.display = isReportsPage ? "block" : "none";
  document.getElementById("feedbackTab").style.display = isFeedbackPage ? "block" : "none";

  document.getElementById("panelHeader").style.display = hideOrderPanel ? "none" : "";
  document.getElementById("adminTools").style.display = hideOrderPanel ? "none" : "";

  if (!hideOrderPanel) {
    document.getElementById("panelTitle").textContent =
      tab === "pending" ? "Pending Orders" : "Completed Orders";
  }

  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  if (tab === "about" && typeof mountAboutPage === "function") mountAboutPage("aboutMount");
  if (tab === "features" && typeof mountFeaturesPage === "function") mountFeaturesPage("featuresMount");
  if (isMenuPage && typeof loadMenuAdmin === "function") loadMenuAdmin();
  if (isReportsPage && typeof loadStallReports === "function") loadStallReports();
  if (isFeedbackPage && typeof loadAdminFeedback === "function") loadAdminFeedback();
}

function clearFilters() {
  document.getElementById("dateFilter").value = "";
  document.getElementById("searchOrder").value = "";
  loadOrders();
}

function logout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  clearAdminSession();
  location.href = "../login/login.html";
}

initStallDashboard();
setInterval(() => {
  if (adminSession) loadOrders();
}, 3000);
setInterval(() => {
  if (document.getElementById("reportsTab")?.style.display === "block") {
    loadStallReports();
  }
  if (document.getElementById("feedbackTab")?.style.display === "block") {
    loadAdminFeedback();
  }
}, 3000);
