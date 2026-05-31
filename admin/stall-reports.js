function loadStallReports() {
  const container = document.getElementById("reportsContainer");
  if (!container) return;

  const stallId = getAdminStallId();
  const stallName = getAdminSession()?.stallName || `Stall ${stallId}`;
  const orders = filterOrdersForAdmin(JSON.parse(localStorage.getItem("orders")) || []);
  const today = new Date().toISOString().split("T")[0];

  const completed = orders.filter(o => o.status === "Picked Up");
  const pending = orders.filter(o => o.status !== "Picked Up");
  const todayCompleted = completed.filter(o => o.date === today);
  const todayRevenue = todayCompleted.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRevenue = completed.reduce((sum, o) => sum + (o.total || 0), 0);

  const itemCounts = {};
  completed.forEach(order => {
    (order.items || []).forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topItemsHtml = topItems.length
    ? topItems.map(([name, qty]) => `<li><span>${name}</span><span>${qty} sold</span></li>`).join("")
    : "<li>No completed orders yet.</li>";

  const menuCount = typeof getMenuByStall === "function"
    ? getMenuByStall(stallId).length
    : 0;

  container.innerHTML = `
    <div class="reports-header">
      <h2>${stallName} — Sales & Reports</h2>
      <p>Overview of menu items, orders, and sales for your stall only.</p>
    </div>

    <div class="reports-grid">
      <div class="report-card">
        <span class="report-value">${menuCount}</span>
        <span class="report-label">Menu Items</span>
      </div>
      <div class="report-card">
        <span class="report-value">${pending.length}</span>
        <span class="report-label">Pending Orders</span>
      </div>
      <div class="report-card gold">
        <span class="report-value">${completed.length}</span>
        <span class="report-label">Completed Orders</span>
      </div>
      <div class="report-card">
        <span class="report-value">₱${todayRevenue}</span>
        <span class="report-label">Today's Sales</span>
      </div>
      <div class="report-card highlight">
        <span class="report-value">₱${totalRevenue}</span>
        <span class="report-label">Total Sales</span>
      </div>
    </div>

    <div class="report-panel">
      <h3>Top Selling Items</h3>
      <ul class="report-list">${topItemsHtml}</ul>
    </div>

    <div class="report-panel">
      <h3>Recent Completed Orders</h3>
      <ul class="report-list">
        ${completed.slice().reverse().slice(0, 8).map(o =>
          `<li><span>#${o.id} · ${o.date || ""}</span><span>₱${o.total}</span></li>`
        ).join("") || "<li>No completed orders yet.</li>"}
      </ul>
    </div>
  `;
}
